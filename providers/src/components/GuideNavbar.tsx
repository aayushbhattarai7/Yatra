import { useState, useEffect } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import NotificationsPopup from "./NotificationPopup";
import ChatPopup from "./ChatPopup";
import ProfilePopup from "./ProfilePopup";
import { getCookie } from "../function/GetCookie";
import {jwtDecode} from "jwt-decode";
import {  useQuery } from "@apollo/client";
import { Bell, Menu, MessageSquare, X } from "lucide-react";
import { GET_GUIDE_CHAT_COUNT, GET_GUIDE_PROFILE, GET_GUIDE_UNREAD_NOTIFICATIONS } from "../mutation/queries";
import { useSocket } from "../contexts/SocketContext";

interface FormData {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  vehicle_type: string;
  gender: string;
  location: Location;
  nationality: string;
  kyc: Image[];
}

interface Image {
  id: string;
  fileType: string;
  path: string;
}

const GuideNavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [guide, setGuide] = useState<FormData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notifications, setNotifications] = useState<number>(0);
  const { socket } = useSocket();
  const { data } = useQuery(GET_GUIDE_UNREAD_NOTIFICATIONS);
  const { data: guideData } = useQuery(GET_GUIDE_PROFILE);
  const [chatCount, setChatCount] = useState<number>(0);
  const {data:chatData, refetch:chatRefetch} = useQuery(GET_GUIDE_CHAT_COUNT)

  const profileImageUrl = guide?.kyc.find(img => img.fileType === "PASSPHOTO")?.path || "/default-avatar.png";

  useEffect(() => {
    if (data?.getUnreadNotificationsOfGuide) {
      setNotifications(data.getUnreadNotificationsOfGuide);
    }
  }, [data]);

  useEffect(() => {
    if (guideData?.getGuideDetails) {
      setGuide(guideData.getGuideDetails);
    }
  }, [guideData]);

  useEffect(() => {
    if (chatData?.getChatCountOfGuide !== undefined) {
      setChatCount(chatData.getChatCountOfGuide);
    }
  }, [chatData]);

  const chatCountListener = (chatCount: any) => {
    console.log("🚀 ~ chatCountListener ~ chatCount:", chatCount)
    setChatCount(chatCount);
    if (chatRefetch) chatRefetch();
  };
  useEffect(() => {
    socket.on("notification", (notificationCount) => {
      console.log("🚀 ~ socket.on ~ notificationCount:", notificationCount);
      setNotifications(notificationCount);
    });

    socket.on("notification-updated", ({ isRead }) => {
      setNotifications(isRead);
    });
    socket.on("chat-count", chatCountListener);

    return () => {
      socket.off("notification-count");
      socket.off("chat-count", chatCountListener);

    };
  }, [socket]);

  useEffect(() => {
    const token = getCookie("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode<{ id: string; email: string }>(token);
        if (decoded) {
          setIsLoggedIn(true);
        }
      } catch {
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);


  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".popup-container")) {
      // closeAllPopups();
    }
  };

  const handleNotifications = () => {
    setShowNotifications(!showNotifications);
    socket.emit("read-guide-notification");
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-[1920px] mx-auto px-6">
        <div className="flex items-center justify-between h-[60px]">
          <RouterNavLink to="/guide" className="text-xl font-bold">
            Yatra
          </RouterNavLink>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" label="Home" />
            <NavLink to="/guide/booking" label="Booking" />
            <NavLink to="/guide/history" label="History" />
          </div>

          {isLoggedIn ? (
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <PopupButton
                  onClick={() => setShowChat(!showChat)}
                  show={showChat}
                  popup={<ChatPopup />}
                  icon={MessageSquare}
                  count={chatCount}
                />
                <PopupButton
                  onClick={() => handleNotifications()}
                  show={showNotifications}
                  popup={<NotificationsPopup />}
                  icon={Bell}
                  count={notifications}
                />
              </div>
              <PopupButton
                onClick={() => setShowProfile(!showProfile)}
                show={showProfile}
                popup={<ProfilePopup />}
                profileImage
                imageUrl={profileImageUrl}
              />
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-6">
              <NavLink to="/guide-login" label="Login" />
              <NavLink to="/guide-register" label="Sign Up" />
            </div>
          )}
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <MobileNavLink
                to="/guide"
                label="Home"
                onClick={() => setIsOpen(false)}
              />
              <MobileNavLink
                to="/guide/booking"
                label="Booking"
                onClick={() => setIsOpen(false)}
              />
              <MobileNavLink
                to="/guide/history"
                label="History"
                onClick={() => setIsOpen(false)}
              />
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              {!isLoggedIn ? (
                <div className="flex flex-col space-y-4 px-4">
                  <RouterNavLink
                    to="/guide-login"
                    className="block text-center text-sm font-medium text-white bg-green-600 py-2 rounded-md hover:bg-green-700 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </RouterNavLink>
                  <RouterNavLink
                    to="/guide-register"
                    className="block text-center text-sm font-medium text-green-600 border border-green-600 py-2 rounded-md hover:bg-green-600 hover:text-white transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </RouterNavLink>
                </div>
              ) : (
                <div className="flex items-center px-5">
                  {guide?.kyc.map((image) => (
                    <div key={image.id}>
                      {image.fileType === "PASSPHOTO" && (
                        <img
                          className="h-10 w-10 rounded-full"
                          src={image.path}
                          alt="Profile"
                        />
                      )}
                    </div>
                  ))}
                
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const PopupButton = ({
  onClick,
  show,
  popup,
  icon: Icon,
  count,
  profileImage,
  imageUrl,
}: {
  onClick: () => void;
  show: boolean;
  popup: JSX.Element;
  icon?: React.ElementType;
  count?: number;
  profileImage?: boolean;
  imageUrl?: string;
}) => (
  <div className="popup-container relative">
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="flex items-center space-x-2"
    >
      {profileImage ? (
        <img
          className="h-8 w-8 rounded-full"
          src={imageUrl}
          alt="Profile"
        />
      ) : (
        Icon && <NotificationIcon icon={Icon} count={count || 0} />
      )}
    </button>
    {show && popup}
  </div>
);

const NavLink = ({ to, label }: NavLinkProps) => (
  <RouterNavLink
    to={to}
    className={({ isActive }) =>
      `text-sm font-medium transition-colors ${
        isActive ? "text-green-600" : "text-black hover:text-gray-600"
      }`
    }
  >
    {label}
  </RouterNavLink>
);

const MobileNavLink = ({ to, label, onClick }: MobileNavLinkProps) => (
  <RouterNavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
        isActive ? "text-green-600" : "text-black hover:text-gray-600"
      }`
    }
  >
    {label}
  </RouterNavLink>
);

const NotificationIcon = ({ icon: Icon, count }: NotificationIconProps) => (
  <div className="relative">
    <Icon className="h-[22px] w-[22px] text-gray-600" />
    {count > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
        {count}
      </span>
    )}
  </div>
);

interface NavLinkProps {
  to: string;
  label: string;
}

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

interface NotificationIconProps {
  icon: React.ElementType;
  count: number;
}

export default GuideNavBar;
