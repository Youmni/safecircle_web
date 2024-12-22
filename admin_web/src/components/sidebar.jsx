import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiCircle,
  FiFileText,
  FiLogOut,
  FiCalendar,
  FiChevronRight,
  FiChevronLeft,
} from "react-icons/fi";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`flex flex-col h-screen bg-navy-800 text-white ${
        isOpen ? "w-64" : "w-16"
      } transition-all duration-300`}
    >
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <button className="text-2xl focus:outline-none">
          {isOpen ? <FiChevronLeft/> : <FiChevronRight/>}
        </button>
      </div>

      <div className="flex-grow">
        <ul className="flex flex-col gap-12 px-4">
          <li>
            <Link
              to="/home"
              className="flex items-center gap-4 p-2 rounded-md hover:bg-navy-600 cursor-pointer"
            ><FiHome size={24} />
              {isOpen && <span>Home</span>}</Link>
          </li>

          <li>
            <Link
              to="/users"
              className="flex items-center gap-4 p-2 rounded-md hover:bg-navy-600 cursor-pointer"
            ><FiUsers size={24} />
              {isOpen && <span>Users</span>}</Link>
          </li>

          <li>
            <Link
              to="/circles"
              className="flex items-center gap-4 p-2 rounded-md hover:bg-navy-600 cursor-pointer"
            ><FiCircle size={24} />
              {isOpen && <span>Circles</span>}</Link>
          </li>

          {/* <li>
            <Link
              to="/reports"
              className="flex items-center gap-4 p-2 rounded-md hover:bg-navy-600 cursor-pointer"
            ><FiFileText size={24} />
              {isOpen && <span>Reports</span>}</Link>
          </li> */}

          <li>
            <Link
              to="/events"
              className="flex items-center gap-4 p-2 rounded-md hover:bg-navy-600 cursor-pointer"
            ><FiCalendar size={24} />
              {isOpen && <span>Events</span>}</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;