///import { Bell, MessageSquare, Menu, X } from "lucide-react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import NotificationsPopup from "./NotificationPopup";
import ChatPopup from "./ChatPopup";
import { getCookie } from "../function/GetCookie";
import { jwtDecode } from "jwt-decode";
import { Bell, Menu, MessageSquare, X } from "lucide-react";
import TravelProfilePopup from "./TravelProfilePopup";
import { useQuery } from "@apollo/client";
import { GET_TRAVEL_NOTIFICATIONS } from "../mutation/queries";
import { useSocket } from "../contexts/SocketContext";
interface Notifications {
  id: string;
  isRead: boolean;
}

const TravelNavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const { socket } = useSocket();

  const { data } = useQuery(GET_TRAVEL_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (data?.getAllNotificationsOfTravel) {
      setNotifications(data.getAllNotificationsOfTravel);
    }
  }, [data]);
  useEffect(() => {
    socket.on("notification", (notification) => {
      setNotifications(notification);
    });
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

  const closeAllPopups = () => {
    setShowNotifications(false);
    setShowChat(false);
    setShowProfile(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".popup-container")) {
      closeAllPopups();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-[1920px] mx-auto px-6">
        <div className="flex items-center justify-between h-[60px]">
          <RouterNavLink to="/travel/home" className="text-xl font-bold">
            Yatra
          </RouterNavLink>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/travel/home" label="Home" />
            <NavLink to="/travel/booking" label="Booking" />
            <NavLink to="/travel/history" label="History" />
          </div>

          {isLoggedIn ? (
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <PopupButton
                  onClick={() => setShowChat(!showChat)}
                  show={showChat}
                  popup={<ChatPopup />}
                  icon={MessageSquare}
                  count={1}
                />
                <PopupButton
                  onClick={() => setShowNotifications(!showNotifications)}
                  show={showNotifications}
                  popup={<NotificationsPopup />}
                  icon={Bell}
                  count={unreadCount}
                />
              </div>
              <PopupButton
                onClick={() => setShowProfile(!showProfile)}
                show={showProfile}
                popup={<TravelProfilePopup />}
                profileImage
              />
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-6">
              <NavLink to="/travel-login" label="Login" />
              <NavLink to="/travel-register" label="Sign Up" />
            </div>
          )}
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <MobileNavLink
                to="/travel/home"
                label="Home"
                onClick={() => setIsOpen(false)}
              />
              <MobileNavLink
                to="/travel/booking"
                label="Booking"
                onClick={() => setIsOpen(false)}
              />
              <MobileNavLink
                to="/travel/history"
                label="History"
                onClick={() => setIsOpen(false)}
              />
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              {!isLoggedIn ? (
                <div className="flex flex-col space-y-4 px-4">
                  <RouterNavLink
                    to="/travel-login"
                    className="block text-center text-sm font-medium text-white bg-green-600 py-2 rounded-md hover:bg-green-700 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </RouterNavLink>
                  <RouterNavLink
                    to="/travel-register"
                    className="block text-center text-sm font-medium text-green-600 border border-green-600 py-2 rounded-md hover:bg-green-600 hover:text-white transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </RouterNavLink>
                </div>
              ) : (
                <div className="flex items-center px-5">
                  <img
                    className="h-10 w-10 rounded-full"
                    src=""
                    alt="Profile"
                  />
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800"></div>
                  </div>
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
}: {
  onClick: () => void;
  show: boolean;
  popup: JSX.Element;
  icon?: React.ElementType;
  count?: number;
  profileImage?: boolean;
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
        <img className="h-8 w-8 rounded-full" src="" alt="Profile" />
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
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
      {count}
    </span>
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

export default TravelNavBar;
