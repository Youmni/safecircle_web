import { useNavigate, useContext, useState, useEffect } from "react";
import axios from "axios";
import { FiLoader } from "react-icons/fi";
import { FaCircleInfo } from "react-icons/fa6";
import { IoSearchOutline } from "react-icons/io5";
import { AuthContext } from "../components/authProvider";
import { enqueueSnackbar } from "notistack";
import UserDetails from "../components/userDetails";

const Users = () => {
  const { accessToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    console.log(accessToken);

    setLoading(true);
    axios
      .get("/api/user/all", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log(response.data)
        setUsers(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }, [accessToken]);

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  const closePopup = () => {
    setShowDetails(false);
    setSelectedUser(null);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const queryParts = query.split(" ");

    const filtered = users.filter((user) => {
      return queryParts.every((part) => {
        return (
          user.firstName?.toLowerCase().includes(part) ||
          user.lastName?.toLowerCase().includes(part) ||
          user.userId?.toString().includes(part)
        );
      });
    });
    setFilteredUsers(filtered);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center border border-gray-300 rounded-xl px-4 py-2 w-full max-w-md bg-white shadow-sm">
          <IoSearchOutline className="text-gray-500" />
          <input
            type="search"
            placeholder="Search by first name, last name or user ID"
            className="ml-2 w-full outline-none bg-transparent text-gray-700"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
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
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(user)}
                >
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {user.userId}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {user.firstName}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {user.lastName}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {<FaCircleInfo />}
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
  );
};

export default Users;
