import React, { useState } from "react";
import { LogoutPopup } from "./LogoutPopup";

const ProfilePopup = () => {
  const [logout, setLogout] = useState<boolean>(false);

  return (
    <>
      {logout && <LogoutPopup onClose={() => setLogout(false)} />}

      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              className="h-10 w-10 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Profile"
            />
            <div>
              <h4 className="text-sm font-semibold">Jon Doe</h4>
              <p className="text-xs text-gray-600">jon.doe@example.com</p>
            </div>
          </div>
        </div>
        <div className="py-2">
          {[
            { label: "Your Profile", href: "/profile" },
            { label: "Settings", href: "/settings" },
            { label: "Trip History", href: "/trips" },
            { label: "Saved Places", href: "/saved" },
            { label: "Help Center", href: "/help" },
          ].map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {item.label}
            </a>
          ))}
          <div className="border-t border-gray-200 mt-2">
            <button
              onClick={() => setLogout(true)}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePopup;
