import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import Cookies from "js-cookie";
import { getCookie } from "@/function/GetCookie";
import { jwtDecode } from "jwt-decode";

export function LogoutPopup({ onClose }: { onClose: () => void }) {

  const handleLogout = () => {
    const token = getCookie("accessToken")
    const decodedToken:{role:string} = jwtDecode(token!)
    const path = decodedToken.role === "ADMIN"?"admin/login":"user-login"
    Cookies.remove("accessToken");
    onClose()

    window.location.href=path
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg shadow-lg w-full max-w-sm mx-4"
      >
        <div className="flex justify-end p-2">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <IoClose size={24} />
          </button>
        </div>
        <div className="px-6 pb-6">
          <h2 className="text-xl font-semibold mb-2">
            Are you sure you want to logout?
          </h2>
          <p className="text-gray-600 mb-6">
            Logout will redirect you to the login page.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              No
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Yes
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
