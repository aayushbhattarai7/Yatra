import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "@/ui/common/organisms/Navbar";
export function Route() {
  const navigate = useNavigate();
  // const token = sessionStorage.getItem("accessToken");
  // useEffect(() => {
  //   if (!token) {
  //     navigate("/login");
  //   } else {
  //     try {
  //       const decoded = jwtDecode(token);
  //       if (!decoded) {
  //         navigate("/login");
  //       }
  //     } catch (error) {
  //       navigate("/login");
  //     }
  //   }
  // }, [token, navigate]);
  return (
    <>
      <Navbar/>
      <Outlet />
    </>
  );
}
