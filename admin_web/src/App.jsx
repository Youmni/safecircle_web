import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {useLocation, Routes, Route} from 'react-router-dom';
import Sidebar from "./components/sideBar";
import Login from './pages/login';
import Home from './pages/home';
import Users from './pages/users';
import Circles from './pages/circles';
import Reports from './pages/reports';
import Events from './pages/events';



function App() {
  const [count, setCount] = useState(0)
  const location = useLocation();

  if (location.pathname === "/"){
    return <Login />;
  } 

  return (
    <div className="flex flex-row min-h-screen max-w-screen">
      {location.pathname !== "/login" && location.pathname !== "/forbidden" && <Sidebar/>}
       <div className="flex-grow bg-gray-100">
      <Routes scrollRestoration={true}>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/circles" element={<Circles />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/events" element={<Events />} />

        <Route path="/forbidden" element={<Forbidden />} />
      </Routes>
      </div>
    </div>
  );
};

  const Forbidden = () => {
    return <div className="flex justify-center items-center h-screen"><p className="text-5xl">403 Forbidden</p></div>;
  };

export default App
