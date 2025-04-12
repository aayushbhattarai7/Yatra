 import { useEffect, useState } from "react";
import { LogoutPopup } from "./LogoutPopup";
import { gql, useQuery } from "@apollo/client";
import { profileImage } from "@/config/constant/image";
interface FormData {
  id: string;
name:string;
  gender: string;
  email: string;
  phoneNumber: string;
}

interface ProfileProps {
  onClose: () => void
}
const AdminProfilePopup:React.FC<ProfileProps> = ({onClose}) => {
  const [logout, setLogout] = useState<boolean>(false);

  const [user, setUser] = useState<FormData | null>(null);
  const GET_ADMIN = gql`
query GetAdmin {
  getAdmin {
  id
  email
  name
  }
}
  `;
  const { data } = useQuery(GET_ADMIN);
  console.log("🚀 ~ data:", data)
  useEffect(() => {
    if (data) {
      setUser(data.getAdmin);
    }
  }, [data]);

  const handleLogoutClick = () => {
    setLogout(true);  
  };
  
  return (
    <>
      {logout && <LogoutPopup onClose={() => setLogout(false)} />}

      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
           
              <div>

                <img className="h-10 w-10 rounded-full" src={profileImage} alt="Profile Image" />

              </div>
          <div>
              <h4 className="text-sm font-semibold">
                {user?.name}
              </h4>
              <p className="text-xs text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>
        <div className="py-2">
          {[
            { label: "Settings", href: "/settings" },
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
              onClick={handleLogoutClick}
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

export default AdminProfilePopup;
