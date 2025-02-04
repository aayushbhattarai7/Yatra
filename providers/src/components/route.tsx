import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
export function Route() {
  const noNavbarRoutes = [
    "/guide-login",
    "/guide-register",
    "/travel-login",
    "/travel-register",
  ];
  const shouldShowNavbar = !noNavbarRoutes.includes(location.pathname);
  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Outlet />
    </>
  );
}
