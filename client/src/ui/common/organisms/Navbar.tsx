import React from "react";
import { NavLink } from "react-router-dom";
import { Bus, MapPin, Home, BookOpen, History } from "lucide-react";

function Navbar() {
  return (
    <nav className="flex items-center gap-8">
      <NavLink
        to="/"
        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
      >
        <Home className="w-4 h-4 flex-shrink-0" />
        <span className="ml-1.5">Home</span>
      </NavLink>
      <NavLink
        to="/places"
        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
      >
        <MapPin className="w-4 h-4 flex-shrink-0" />
        <span className="ml-1.5">Places</span>
      </NavLink>
      <NavLink
        to="/travel"
        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
      >
        <Bus className="w-4 h-4 flex-shrink-0" />
        <span className="ml-1.5">Travel</span>
      </NavLink>
      <NavLink
        to="/guide"
        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
      >
        <BookOpen className="w-4 h-4 flex-shrink-0" />
        <span className="ml-1.5">Guide</span>
      </NavLink>
      <NavLink
        to="/history"
        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
      >
        <History className="w-4 h-4 flex-shrink-0" />
        <span className="ml-1.5">History</span>
      </NavLink>
    </nav>
  );
}

export default Navbar;
