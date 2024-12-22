import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(Cookies.get('accessToken') || null);
  const [refreshToken, setRefreshToken] = useState(Cookies.get('refreshToken') || null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken || !refreshToken) {
      navigate('/login');
    }
  }, [accessToken, refreshToken, navigate]);

  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        else{
          navigate('/login');
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [accessToken]);

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post('http://localhost:8080/user/refresh-token', {
        refreshToken: refreshToken,
      });

      const { accessToken, refreshToken } = response.data;
      console.log(accessToken);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      const tokenExpiryTime = 1 / 24;

      Cookies.set("accessToken", accessToken, {
        secure: false, 
        sameSite: "Strict",
        expires: tokenExpiryTime,
      });
      Cookies.set("refreshToken", refreshToken, {
        secure: false,
        sameSite: "Strict",
        expires: 7,
      });
    } catch (error) {
      console.error('Error refreshing access token:', error);

      setAccessToken(null);
      setRefreshToken(null);
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, refreshAccessToken, setRefreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};
