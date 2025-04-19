import { useEffect, useState } from "react";
import { LogoutPopup } from "./LogoutPopup";
import { useQuery } from "@apollo/client";
import { GET_GUIDE_PROFILE } from "../mutation/queries";
interface FormData {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  email: string;
  phoneNumber: string;
}
const ProfilePopup = () => {
  const [logout, setLogout] = useState<boolean>(false);

  const [user, setUser] = useState<FormData | null>(null);

  const { data, loading, error } = useQuery(GET_GUIDE_PROFILE);
  useEffect(() => {
    if (data) {
      setUser(data.getGuideDetails);
    }
  }, [data]);

  return (
    <>
      {logout && <LogoutPopup onClose={() => setLogout(false)} />}

      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img className="h-10 w-10 rounded-full" alt="Profile" />
            <div>
              <h4 className="text-sm font-semibold">
                {user?.firstName} {user?.middleName} {user?.lastName}
              </h4>
              <p className="text-xs text-gray-600">{user?.email}</p>
              <p className="text-xs text-gray-600">{user?.phoneNumber}</p>
            </div>
          </div>
        </div>
        <div className="py-2">
          {[
            { label: "Your Profile", href: "/guide/profile" },
            { label: "Settings", href: "/guide/settings" },
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
