import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import GuideNavBar from "./GuideNavbar";
import TravelNavBar from "./TravelNavBar";
import { getCookie } from "../function/GetCookie";
import { jwtDecode } from "jwt-decode";
import Navbar from "./Navbar";

export function Route() {
  const noNavbarRoutes = [
    "/guide-login",
    "/guide-register",
    "/travel-login",
    "/travel-register",
  ];
  const hasRequestedNotificationPermission = useRef(false);

  const location = useLocation();
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => {
    if ("Notification" in window && !hasRequestedNotificationPermission.current) {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
        hasRequestedNotificationPermission.current = true; 
      });
    }
  }, []);
  useEffect(() => {
    const token = getCookie("accessToken");
    if (token) {
      try {
        const decodedToken: { role: string } = jwtDecode(token);
        setRole(decodedToken.role);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      setRole(null);
    }
  }, [location.pathname]);

  const shouldShowNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar &&
        (role === "GUIDE" ? (
          <GuideNavBar />
        ) : role === "TRAVEL" ? (
          <TravelNavBar />
        ) : (
          <Navbar />
        ))}
      <Outlet />
    </>
  );
}
