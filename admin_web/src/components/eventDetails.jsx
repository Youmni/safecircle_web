import React, { useEffect, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { AuthContext } from "../components/authProvider";

const EventDetails = ({ event, onClose }) => {
  const [circleName, setCircleName] = useState(event.eventName);
  const [circleType] = useState("EVENT");
  const [available] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const { accessToken } = useContext(AuthContext);

  if (!event) {
    return null;
  }

  const handleAddCircle = async () => {
    const userId = jwtDecode(accessToken).sub;

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
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setSuccessMessage("Circle created successfully!");
      setErrorMessage(null);
    } catch (error) {
      console.error("Error creating circle:", error);
      setSuccessMessage(null);
      setErrorMessage(error.response.data);
    }
  };

  const handleDeleteCircle = async () => {
    const userId = jwtDecode(accessToken).sub;
    const circleId = event.circleid

    try {
      const response = await axios.delete(
        `/api/circle/${circleId}/delete`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setSuccessMessage("Circle deleted successfully!");
      setErrorMessage(null);
    } catch (error) {
      console.error("Error deleting circle:", error);
      setSuccessMessage(null);
      setErrorMessage(error.response?.data || "Error deleting circle.");
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <div className="bg-white rounded-2xl shadow-lg p-6 relative overflow-y-auto max-w-3xl w-[90%]">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Event: {event.eventName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 text-xl"
            >
              ×
            </button>
          </div>

          <div className="p-4">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem label="ID" value={event.eventId} />
                <DetailItem label="Type" value={event.eventStatus.toLowerCase()} />
                <DetailItem label="Email" value={event.email} />
                <DetailItem label="Start Date" value={event.startDate} />
                <DetailItem label="End Date" value={event.endDate} />
                <DetailItem
                  label="Location"
                  value={
                    <a
                      href={`https://www.google.com/maps?q=${event.location.latitude},${event.location.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View location
                    </a>
                  }
                />
                <div className="p-4 bg-gray-100 rounded-lg">
                  <button
                    onClick={handleAddCircle}
                    className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Add Circle
                  </button>
                  <button
                    onClick={handleDeleteCircle}
                    className="py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ml-4"
                  >
                    Delete Circle
                  </button>
                </div>
              </div>
            </div>

            {successMessage && (
              <p className="text-green-500 mt-4">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="text-red-500 mt-4">{errorMessage}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="p-4 bg-gray-100 rounded-lg">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-lg font-medium text-gray-700">{value}</p>
  </div>
);

export default EventDetails;
