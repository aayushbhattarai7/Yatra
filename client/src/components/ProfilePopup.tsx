 import { useEffect, useState } from "react";
import { LogoutPopup } from "./LogoutPopup";
import { gql, useQuery } from "@apollo/client";
interface FormData {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  email: string;
  phoneNumber: string;
  image:Image[]
}
interface Image{
  id:string;
  path:string;
  type:string;
}
interface ProfileProps {
  onClose: () => void
}
const ProfilePopup:React.FC<ProfileProps> = () => {
  const [logout, setLogout] = useState<boolean>(false);

  const [user, setUser] = useState<FormData | null>(null);
  const GET_USER_QUERY = gql`
    query GetUser {
      getUser {
        id
        firstName
        middleName
        lastName
        email
        phoneNumber
        gender
        image{
        id
        path
        type
        }
      }
    }
  `;
  const { data } = useQuery(GET_USER_QUERY);
  console.log("🚀 ~ data:", data)
  useEffect(() => {
    if (data) {
      setUser(data.getUser);
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
            {user?.image.map((image)=>(
              <div>
{image.type === "PROFILE" && (

                <img className="h-10 w-10 rounded-full" src={image.path} alt="Profile Image" />
)}
              </div>
            ))}
          <div>
              <h4 className="text-sm font-semibold">
                {user?.firstName} {user?.middleName} {user?.lastName}
              </h4>
              <p className="text-xs text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>
        <div className="py-2">
          {[
            { label: "Your Profile", href: "/user-profile" },
            { label: "Settings", href: "/settings" },
            { label: "Saved Places", href: "/saved" },
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

export default ProfilePopup;
