import { useNavigate, useContext, useState, useEffect } from "react";
import axios from "axios";
import { FiLoader } from "react-icons/fi";
import { FaCircleInfo } from "react-icons/fa6";
import { IoSearchOutline } from "react-icons/io5";
import { AuthContext } from "../components/authProvider";
import { enqueueSnackbar } from "notistack";
import EventDetails from "../components/eventDetails";

const Events = () => {
  const { accessToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [selectEvent, setSelectEvent] = useState(null);

  useEffect(() => {
    console.log(accessToken);

    setLoading(true);
    axios
      .get("/api/event/all", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setEvents(response.data);
        setFilteredEvents(response.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }, [accessToken]);

  const closePopup = () => {
    setShowDetails(false);
    setSelectEvent(null);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const queryParts = query.split(" ");

    const filtered = events.filter((event) => {
      return queryParts.every((part) => {
        return (
          event.eventName?.toLowerCase().includes(part) ||
          event.eventStatus?.toLowerCase().includes(part) ||
          event.eventId?.toString().includes(part)
        );
      });
    });
    setFilteredEvents(filtered);
  };

  const handleStatusChange = (eventId, newStatus) => {
    const updatedEvents = events.map((e) =>
      e.eventId === eventId ? { ...e, eventStatus: newStatus } : e
    );
    setEvents(updatedEvents);

    const updatedFilteredEvents = updatedEvents.filter((event) =>
      event.eventName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEvents(updatedFilteredEvents);

    axios
      .patch(`/api/event/status/${eventId}?newStatus=${newStatus}`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        enqueueSnackbar("Event status updated successfully!", { variant: "success" });
      })
      .catch((error) => {
        console.error("Failed to update event status:", error);
        enqueueSnackbar("Failed to update event status", { variant: "error" });
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Events</h1>

      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center border border-gray-300 rounded-xl px-4 py-2 w-full max-w-md bg-white shadow-sm">
          <IoSearchOutline className="text-gray-500" />
          <input
            type="search"
            placeholder="Search by event name, status, or ID"
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
                Name
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                +- Visitors
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <tr
                  key={event.eventId}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {event.eventId}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {event.eventName}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    <select
                      value={event.eventStatus}
                      onChange={(e) =>
                        handleStatusChange(event.eventId, e.target.value)
                      }
                      className="border border-gray-300 rounded-md p-1 text-gray-700"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {event.userCountEstimate}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    <FaCircleInfo
                      className="hover:text-blue-700 cursor-pointer"
                      onClick={() => {
                        setSelectEvent(event);
                        setShowDetails(true);
                      }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="py-2 px-4 text-center text-sm text-gray-500"
                >
                  No events found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {showDetails && selectEvent && (
          <EventDetails onClose={closePopup} event={selectEvent} />
        )}
      </div>
    </div>
  );
};

export default Events;
