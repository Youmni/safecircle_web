import React, { useEffect, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import CircleUserDetails from "./CircleUserDetails";

const CircleDetails = ({ circle, onClose }) => {

  const [showUserDetails, setShowUserDetails] = useState(false);

  if (!circle) {
    return null;
  }

  const handleShowUserDetails = () => {
    setShowUserDetails(true);
  };

  const handleCloseUserDetails = () => {
    setShowUserDetails(false);
  };
  
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      {!showUserDetails ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 relative overflow-y-auto max-w-3xl w-[90%]">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Name: {circle.circleName}
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
                  <DetailItem label="ID" value={circle.circleId} />
                  <DetailItem label="Type" value={circle.circleType.toLowerCase()} />
                  <DetailItem label="Created At" value={circle.createdAt} />
                  <DetailItem label="Updated At" value={circle.updatedAt} />

                  <DetailItem
                    label="Users"
                    value={
                      <div
                        onClick={handleShowUserDetails}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <FaCircleInfo className="text-blue-500" />
                        <span className="text-gray-700">User information</span>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <CircleUserDetails
          circleId={circle.circleId}
          onClose={handleCloseUserDetails}
        />
      )}
    </>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="p-4 bg-gray-100 rounded-lg">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-lg font-medium text-gray-700">{value}</p>
  </div>
);

export default CircleDetails;
