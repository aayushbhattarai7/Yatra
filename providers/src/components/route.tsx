import { Outlet } from "react-router-dom";
import GuideNavBar from "./GuideNavbar";
import TravelNavBar from "./TravelNavBar";
import { getCookie } from "../function/GetCookie";
import { jwtDecode } from "jwt-decode";

export function Route() {
  const noNavbarRoutes = [
    "/guide-login",
    "/guide-register",
    "/travel-login",
    "/travel-register",
  ];

  const token = getCookie("accessToken");
  let role = null;

  if (token) {
    try {
      const decodedToken: { role: string } = jwtDecode(token);
      role = decodedToken.role;
      console.log(role, "---");
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  const shouldShowNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar &&
        (role === "GUIDE" ? (
          <GuideNavBar />
        ) : role === "TRAVEL" ? (
          <TravelNavBar />
        ) : null)}
      <Outlet />
    </>
  );
}
