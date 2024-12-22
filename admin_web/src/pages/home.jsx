import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaBell, FaFileAlt, FaRegCalendarAlt } from "react-icons/fa";
import { AuthContext } from "../components/authProvider";
import { FiLoader } from "react-icons/fi";

const Home = () => {
  const { accessToken } = useContext(AuthContext);
  const [locations, setLocations] = useState([]);
  const [statistics, setStatistics] = useState({
    users: "...",
    alerts: "...",
    reports: "...",
    events: "...",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("api/statistics/numbers", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const data = response.data;
        const newStatistics = {
          users: 0,
          alerts: 0,
          reports: 0,
          events: 0,
        };

        data.forEach((item) => {
          if (item.className.toLowerCase() === "users") {
            newStatistics.users = item.amount;
          } else if (item.className.toLowerCase() === "alerts") {
            newStatistics.alerts = item.amount;
          } else if (item.className.toLowerCase() === "reports") {
            newStatistics.reports = item.amount;
          } else if (item.className.toLowerCase() === "events") {
            newStatistics.events = item.amount;
          }
        });

        setStatistics(newStatistics);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching statistics:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get("api/alert/latest", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setLocations(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="flex justify-between mb-8">
        <div className="flex flex-col items-center bg-white p-6 shadow rounded-lg w-1/5">
          <FaUser className="text-blue-500 text-4xl mb-2" />
          <h2 className="text-lg font-semibold text-gray-700">Users</h2>
          <span className="text-xl font-bold text-black">{statistics.users}</span>
        </div>
        <div className="flex flex-col items-center bg-white p-6 shadow rounded-lg w-1/5">
          <FaBell className="text-green-500 text-4xl mb-2" />
          <h2 className="text-lg font-semibold text-gray-700">Alerts</h2>
          <span className="text-xl font-bold text-black">{statistics.alerts}</span>
        </div>
        <div className="flex flex-col items-center bg-white p-6 shadow rounded-lg w-1/5">
          <FaFileAlt className="text-orange-500 text-4xl mb-2" />
          <h2 className="text-lg font-semibold text-gray-700">Reports</h2>
          <span className="text-xl font-bold text-black">{statistics.reports}</span>
        </div>
        <div className="flex flex-col items-center bg-white p-6 shadow rounded-lg w-1/5">
          <FaRegCalendarAlt className="text-purple-500 text-4xl mb-2" />
          <h2 className="text-lg font-semibold text-gray-700">Events</h2>
          <span className="text-xl font-bold text-black">{statistics.events}</span>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center mb-4">
          <FiLoader className="animate-spin text-3xl text-gray-600" />
        </div>
      )}

      <div className="w-full max-h-96 overflow-y-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Last 24 hours</h2>
      <table className="min-w-full table-auto border-collapse bg-white shadow rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                Description
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                Location
              </th>
            </tr>
          </thead>
          <tbody>
            {locations.length > 0 ? (
              locations.map((location, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {location.firstName} {location.lastName}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {location.status}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {location.description}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    <a
                      href={`https://www.google.com/maps?q=${location.location.latitude},${location.location.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View on Google Maps
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="py-2 px-4 text-center text-sm text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
