import React, { useEffect, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import CircleUserDetails from "./CircleUserDetails";

const EventDetails = ({ event, onClose }) => {
  const [showEventDetails, setShowEventDetails] = useState(false);

  if (!event) {
    return null;
  }

  const handleShowEventDetails = () => {
    setShowEventDetails(true);
  };

  const handleCloseEventDetails = () => {
    setShowEventDetails(false);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="p-4 bg-gray-100 rounded-lg">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-lg font-medium text-gray-700">{value}</p>
  </div>
);

export default EventDetails;
