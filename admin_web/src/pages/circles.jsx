import { useNavigate, useContext, useState, useEffect } from "react";
import axios from "axios";
import { FiLoader } from "react-icons/fi";
import { FaCircleInfo } from "react-icons/fa6";
import { IoSearchOutline } from "react-icons/io5";
import { AuthContext } from "../components/authProvider";
import { enqueueSnackbar } from "notistack";
import UserDetails from "../components/userDetails";
import CircleDetails from "../components/circleDetails";

const Circles = () => {
  const { accessToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [circles, setCircles] = useState([]);
  const [filteredCircles, setFilteredCircles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState(null);

  useEffect(() => {
    console.log(accessToken);

    setLoading(true);
    axios
      .get("/api/circle/all", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log(response.data)
        setCircles(response.data);
        setFilteredCircles(response.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        enqueueSnackbar("Error receiving circles", { variant: "error" });
        setLoading(false);
      });
  }, [accessToken]);

  const handleRowClick = (circle) => {
    setSelectedCircle(circle);
    setShowDetails(true);
  };

  const closePopup = () => {
    setShowDetails(false);
    setSelectedCircle(null);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const queryParts = query.split(" ");

    const filtered = circles.filter((circle) => {
      return queryParts.every((part) => {
        return (
          circle.circleName?.toLowerCase().includes(part) ||
          circle.circleType?.toLowerCase().includes(part) ||
          circle.circleId?.toString().includes(part)
        );
      });
    });
    setFilteredCircles(filtered);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Circles</h1>

      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center border border-gray-300 rounded-xl px-4 py-2 w-full max-w-md bg-white shadow-sm">
          <IoSearchOutline className="text-gray-500" />
          <input
            type="search"
            placeholder="Search by name, type or ID"
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
                Available
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                Circle Name
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                Circle Type
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                Info
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCircles.length > 0 ? (
              filteredCircles.map((circle) => (
                <tr
                  key={circle.circleId}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(circle)}
                >
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {circle.circleId}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {circle.available === true ? "available" : "not available"}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {circle.circleName}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {circle.circleType}
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
                  No circles found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {showDetails && selectedCircle && (
          <CircleDetails
            onClose={closePopup}
            circle={selectedCircle}
          />
        )}
      </div>
    </div>
  );
};

export default Circles;