import React, { useEffect, useState, useContext } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import { AuthContext } from "./authProvider";
import axios from "axios";
import { FiLoader } from "react-icons/fi";


const UserBlacklistDetails = ({ user, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { accessToken } = useContext(AuthContext);
  const [blacklists, setBlacklists] = useState([]);
  if (!user) {
    return null;
  }

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`api/showAll/${user.userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setBlacklists(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
        setLoading(false);
      });
  }, []);

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
          <div className="mb-4">
            {loading && <FiLoader className="animate-spin" />}
          </div>
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                  ID
                </th>
                <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                  Description
                </th>
                <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                  Start Date
                </th>
                <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                  End Date
                </th>
              </tr>
            </thead>
            <tbody>
              {blacklists.length > 0 ? (
                blacklists.map((blacklist) => (
                  <tr
                    key={blacklist.blacklistId}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="py-2 px-4 border-b text-sm text-gray-700">
                      {blacklist.blacklistId}
                    </td>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">
                      {blacklist.description}
                    </td>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">
                      {blacklist.startDate}
                    </td>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">
                      {blacklist.endDate}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-2 px-4 text-center text-sm text-gray-500"
                  >
                    No blacklists found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserBlacklistDetails;
