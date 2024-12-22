import React, { useEffect, useState, useContext } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import UserDetails from "../components/userDetails";
import { FiLoader } from "react-icons/fi";
import axios from "axios";
import { AuthContext } from "../components/authProvider";



const CircleUserDetails = ({ circleId, onClose }) => {

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { accessToken } = useContext(AuthContext);


  if (!circleId) {
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
      .get(`api/circle/users/${circleId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log(response.data)
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
        setLoading(false);
      });
  }, []);

  const handleShowDetails = (user) => {
    console.log(user)
    setSelectedUser(user);
    setShowDetails(true);
  };
  
  const closePopup = () => {
    setSelectedUser(null);
    setShowDetails(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 relative overflow-y-auto max-w-3xl w-[90%]">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Users
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
                First Name
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                Last Name
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                Info
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {user.firstName}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {user.lastName}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {<FaCircleInfo  onClick={() => handleShowDetails(user)}  />}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="py-2 px-4 text-center text-sm text-gray-500"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {showDetails && selectedUser && (
          <UserDetails
            onClose={closePopup}
            user={selectedUser}
          />
        )}
      </div>
    </div>
</div>
  );
};

export default CircleUserDetails;
