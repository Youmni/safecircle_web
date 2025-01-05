import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaBell, FaFileAlt, FaRegCalendarAlt } from "react-icons/fa";
import { AuthContext } from "../components/authProvider";
import { FiLoader } from "react-icons/fi";
import { Map, Marker, Overlay } from "pigeon-maps";

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
  const [selectedLocation, setSelectedLocation] = useState(null);

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
          switch (item.className.toLowerCase()) {
            case "users":
              newStatistics.users = item.amount;
              break;
            case "alerts":
              newStatistics.alerts = item.amount;
              break;
            case "reports":
              newStatistics.reports = item.amount;
              break;
            case "events":
              newStatistics.events = item.amount;
              break;
            default:
              break;
          }
        });

        setStatistics(newStatistics);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching statistics:", error);
        setLoading(false);
      });
  }, [accessToken]);

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
  }, [accessToken]);

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
  };

  const handleClosePopup = () => {
    setSelectedLocation(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="flex justify-between mb-8">
        {Object.entries(statistics).map(([key, value]) => (
          <div
            key={key}
            className="flex flex-col items-center bg-white p-6 shadow rounded-lg w-1/5"
          >
            {key === "users" && (
              <FaUser className="text-blue-500 text-4xl mb-2" />
            )}
            {key === "alerts" && (
              <FaBell className="text-green-500 text-4xl mb-2" />
            )}
            {key === "reports" && (
              <FaFileAlt className="text-orange-500 text-4xl mb-2" />
            )}
            {key === "events" && (
              <FaRegCalendarAlt className="text-purple-500 text-4xl mb-2" />
            )}
            <h2 className="text-lg font-semibold text-gray-700">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </h2>
            <span className="text-xl font-bold text-black">{value}</span>
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center mb-4">
          <FiLoader className="animate-spin text-3xl text-gray-600" />
        </div>
      )}

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Recent Alerts in the Last 24 Hours
      </h2>
      <div className="w-full max-h-96 overflow-y-auto">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse bg-white shadow rounded-lg">
            <thead className="bg-gray-100 sticky top-0 z-10">
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

      <div className="w-full max-h-96 overflow-hidden">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Map Locations in the Last 24 Hours
        </h2>
        <Map height={500} defaultCenter={[51.505, -0.09]} defaultZoom={12}>
          {locations.map((location, index) => (
            <Marker
              key={index}
              width={50}
              anchor={[location.location.latitude, location.location.longitude]}
              onClick={() => handleMarkerClick(location)}
            />
          ))}
          {selectedLocation && (
            <Overlay
              anchor={[
                selectedLocation.location.latitude,
                selectedLocation.location.longitude,
              ]}
              offset={[0, 10]}
            >
              <div className="bg-white text-black p-2 rounded shadow">
                <strong>
                  {selectedLocation.firstName} {selectedLocation.lastName}
                </strong>
                <br />
                {selectedLocation.description}
                <br />
                <a
                  href={`https://www.google.com/maps?q=${selectedLocation.location.latitude},${selectedLocation.location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View on Google Maps
                </a>
                <button
                  onClick={handleClosePopup}
                  className="ml-2 text-red-500 hover:underline"
                >
                  Close
                </button>
              </div>
            </Overlay>
          )}
        </Map>
      </div>
    </div>
  );
};

export default Home;
