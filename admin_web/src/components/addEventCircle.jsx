import React, { useState, useContext } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import { AuthContext } from "../components/authProvider";

const AddEventCircle = () => {
  const [circleName, setCircleName] = useState("");
  const [circleType, setCircleType] = useState("");
  const [available, setAvailable] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { accessToken } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!accessToken) {
      setErrorMessage("Access token is missing. Please log in again.");
      return;
    }

    let userId;
    try {
      userId = jwtDecode(accessToken).sub;
    } catch (error) {
      setErrorMessage("Invalid access token. Please log in again.");
      return;
    }

    const newCircle = {
      circleName,
      circleType,
      available,
    };

    try {
      const response = await axios.post(
        `/api/circle/${userId}/create`,
        newCircle,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setSuccessMessage("Circle created successfully!");
      setCircleName("");
      setCircleType("");
      setAvailable(false);
    } catch (error) {
      console.error("Error creating circle:", error);
      setErrorMessage(
        error.response?.data?.message || "An error occurred while creating the circle."
      );
    }
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-semibold mb-4">Add New Event Circle</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="circleName" className="block text-sm font-medium text-gray-700">
            Circle Name
          </label>
          <input
            id="circleName"
            type="text"
            value={circleName}
            onChange={(e) => setCircleName(e.target.value)}
            placeholder="Enter circle name"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="available"
            type="checkbox"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="available" className="text-sm font-medium text-gray-700">
            Available
          </label>
        </div>

        <button
          type="submit"
          className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Circle
        </button>
      </form>

      {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
    </div>
  );
};

export default AddEventCircle;