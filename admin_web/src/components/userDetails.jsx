import React, { useEffect, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import UserBlacklistDetails from "./userBlacklistDetails";

const UserDetails = ({ user, onClose }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showBlacklists, setShowBlacklists] = useState(false);
  const [showCircles, setShowCircles] = useState(false);

  if (!user) {
    return null;
  }

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleShowBlacklists = () => {
    setShowBlacklists(true);
  };

  const handleShowCircles = () => {
    setShowCircles(true);
  };

  const closeBlacklists = () => {
    setShowBlacklists(false);
  };

  const closeCircles = () => {
    setShowCircles(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 relative overflow-y-auto max-w-3xl w-[90%]">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {user.firstName} {user.lastName}
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
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                <FaRegUserCircle size={40} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-700">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="ID" value={user.userId} />
              <DetailItem label="Date of Birth" value={user.dateOfBirth} />
              <DetailItem
                label="Phone Number"
                value={user.phoneNumber || "-"}
              />
              <DetailItem
                label="Blacklists"
                value={
                  <div
                    onClick={handleShowBlacklists}
                    className="flex items-center gap-2  cursor-pointer"
                  >
                    <FaCircleInfo className="text-red-500" />
                    <span className="text-gray-700">Blacklist information</span>
                  </div>
                }
              />
              {/* <DetailItem
                label="Circles"
                value={
                  <div
                    onClick={handleShowCircles}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <FaCircleInfo className="text-blue-500" />
                    <span className="text-gray-700">Circle information</span>
                  </div>
                }
              /> */}
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-0 w-full px-6 flex justify-end">
          <button
            onClick={onClose}
            className="text-blue-600 hover:underline font-semibold"
          >
            Close
          </button>
        </div>
      </div>
      {showBlacklists && (
        <UserBlacklistDetails user={user} onClose={closeBlacklists} />
      )}
      {showCircles && (
        <UserCircleDetails user={user} onClose={closeCircles} />
      )}
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="p-4 bg-gray-100 rounded-lg">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-lg font-medium text-gray-700">{value}</p>
  </div>
);

export default UserDetails;
