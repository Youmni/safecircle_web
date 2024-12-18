import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {useLocation, Routes, Route} from 'react-router-dom';
import Login from './pages/login'

function App() {
  const [count, setCount] = useState(0)
  const location = useLocation();

  if (location.pathname === "/"){
    return <Login />;
  } 

  return (
    <div className="flex flex-col min-h-screen max-w-screen">
      <Routes scrollRestoration={true}>
        <Route path="/login" element={<Login />} />
        <Route path="/forbidden" element={<Forbidden />} />
      </Routes>
    </div>
  );
};

  const Forbidden = () => {
    return <div className="flex justify-center items-center h-screen"><p className="text-5xl">403 Forbidden</p></div>;
  };

export default App
