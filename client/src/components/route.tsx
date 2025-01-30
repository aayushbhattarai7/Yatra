
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
export function Route() {

  const noNavbarRoutes = ["/user-login", "/user-register","/adminLogin","/travel-register"];
  const shouldShowNavbar = !noNavbarRoutes.includes(location.pathname);
  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Outlet />
    </>
  );
}
