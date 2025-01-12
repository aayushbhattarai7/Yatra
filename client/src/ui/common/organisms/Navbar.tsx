import { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-600">Yatra</h1>

        <div className="hidden md:flex items-center space-x-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-lg font-medium ${
                isActive
                  ? "text-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/places"
            className={({ isActive }) =>
              `text-lg font-medium ${
                isActive
                  ? "text-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`
            }
          >
            Places
          </NavLink>
          <NavLink
            to="/travel"
            className={({ isActive }) =>
              `text-lg font-medium ${
                isActive
                  ? "text-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`
            }
          >
            Travel
          </NavLink>
          <NavLink
            to="/guides"
            className={({ isActive }) =>
              `text-lg font-medium ${
                isActive
                  ? "text-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`
            }
          >
            Guide
          </NavLink>
          <NavLink
            to="/booking"
            className={({ isActive }) =>
              `text-lg font-medium ${
                isActive
                  ? "text-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`
            }
          >
            Booking
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `text-lg font-medium ${
                isActive
                  ? "text-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`
            }
          >
            History
          </NavLink>
        </div>

        <div className="md:flex items-center space-x-6">
          <button className="relative">
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              2
            </span>
            <p>Chat</p>
          </button>
          <button className="relative">
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
            <p>Noti</p>
          </button>
          <div className="flex items-center space-x-2">
            <img src="" alt="Profile" className="w-8 h-8 rounded-full" />
            <span className="text-lg font-medium text-gray-800">Jon Doe</span>
          </div>
        </div>

        {!isOpen && (
          <button
            className="md:hidden flex flex-col space-y-1 w-8 h-8 items-center justify-center"
            onClick={toggleMenu}
          >
            <span className="block w-6 h-[2px] bg-gray-800"></span>
            <span className="block w-6 h-[2px] bg-gray-800"></span>
            <span className="block w-6 h-[2px] bg-gray-800"></span>
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-0 left-0 w-full h-screen bg-white flex flex-col items-center justify-center transition-transform duration-300">
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-2xl font-semibold py-4 ${
                isActive
                  ? "text-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/places"
            className={({ isActive }) =>
              `text-2xl font-semibold py-4 ${
                isActive
                  ? "text-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Places
          </NavLink>
          <NavLink
            to="/travel"
            className={({ isActive }) =>
              `text-2xl font-semibold py-4 ${
                isActive
                  ? "text-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Travel
          </NavLink>
          <NavLink
            to="/guide"
            className={({ isActive }) =>
              `text-2xl font-semibold py-4 ${
                isActive
                  ? "text-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Guide
          </NavLink>
          <NavLink
            to="/booking"
            className={({ isActive }) =>
              `text-2xl font-semibold py-4 ${
                isActive
                  ? "text-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Booking
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `text-2xl font-semibold py-4 ${
                isActive
                  ? "text-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            History
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
