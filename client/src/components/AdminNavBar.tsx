import { Bell, MessageSquare, Menu, X } from "lucide-react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import NotificationsPopup from "./NotificationPopup";
import ChatPopup from "./ChatPopup";
import ProfilePopup from "./ProfilePopup";
import { getCookie } from "@/function/GetCookie";
import { jwtDecode } from "jwt-decode";
import { useQuery } from "@apollo/client";
import { GET_USER_CHAT_COUNT, GET_USER_NOTIFICATIONS } from "@/mutation/queries";
import { useSocket } from "@/contexts/SocketContext";
import { profileImage } from "@/config/constant/image";
import { useLang } from "@/hooks/useLang";
import { authLabel } from "@/localization/auth";

interface Notifications {
  id: string;
  isRead: boolean;
}

const Navbar = () => {
  const { socket } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatCount, setChatCount] = useState<number>(0);
  
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const { lang } = useLang();
  const { data: notificationData } = useQuery(GET_USER_NOTIFICATIONS);
  const { data: chatData, refetch } = useQuery(GET_USER_CHAT_COUNT);
 
  useEffect(() => {
    if (notificationData) {
      setNotifications(notificationData.getAllNotificationsOfUser);
    }
  }, [notificationData]);
 
  useEffect(() => {
    if (chatData?.getChatCount !== undefined) {
      setChatCount(chatData.getChatCount);
    }
  }, [chatData]);
  
  useEffect(() => {
    const chatCountListener = (chatCount: any) => {
      setChatCount(chatCount.chatCount);
      if (refetch) refetch();
    };
    
    socket.on("notification", (notification) => {
      setNotifications((prev) => [...prev, notification]);
    });
    socket.on("chat-count", chatCountListener);
  
    return () => {
      socket.off("chat-count", chatCountListener);
    };
  }, [socket]);
  

  const token = getCookie("accessToken")!;
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<{ id: string; email: string }>(token);
        setIsLoggedIn(!!decoded);
      } catch (error) {
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  
  const handleNotificationClick = () => {
    setShowChat(false);
    setShowNotifications(!showNotifications);
    setShowProfile(false);
    const decode = jwtDecode<{ id: string }>(token);
    socket.emit("read-user-notification", decode.id);
  };

  const openChat = () => {
    setShowChat(!showChat);
    setShowNotifications(false);
    setShowProfile(false);
  };

  const openProfile = () => {
    setShowChat(false);
    setShowNotifications(false);
    setShowProfile(!showProfile);
  };
  
  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-[1920px] mx-auto px-6">
        <div className="flex items-center justify-between h-[60px]">
          <RouterNavLink to="/" className="text-xl font-bold">
            {authLabel.Yatra[lang]}
          </RouterNavLink>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <div className="hidden md:flex items-center space-x-8">
            <RouterNavLink to="/admin" className="text-sm font-medium hover:text-gray-600">{authLabel.home[lang]}</RouterNavLink>
            <RouterNavLink to="/admin/places" className="text-sm font-medium hover:text-gray-600">{authLabel.place[lang]}</RouterNavLink>
            <RouterNavLink to="/admin/travels" className="text-sm font-medium hover:text-gray-600">{authLabel.travel[lang]}</RouterNavLink>
            <RouterNavLink to="/admin/guides" className="text-sm font-medium hover:text-gray-600">{authLabel.guide[lang]}</RouterNavLink>
            <RouterNavLink to="/booking" className="text-sm font-medium hover:text-gray-600">{authLabel.booking[lang]}</RouterNavLink>
            <RouterNavLink to="/history" className="text-sm font-medium hover:text-gray-600">{authLabel.history[lang]}</RouterNavLink>
          </div>
 
          {isLoggedIn ? (
            <div className="hidden md:flex items-center space-x-6">
              <PopupButton
                onClick={openChat}
                show={showChat}
                popup={<ChatPopup />}
                icon={MessageSquare}
                count={chatCount}
              />
              <PopupButton
                onClick={handleNotificationClick}
                show={showNotifications}
                popup={<NotificationsPopup />}
                icon={Bell}
                // count={unreadCount}
              />
              <PopupButton
                onClick={openProfile}
                show={showProfile}
                popup={<ProfilePopup onClose={()=>setShowProfile(false)} />}
                profileImg
              />
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-6">
              <RouterNavLink to="/user-login" className="text-sm font-medium hover:text-gray-600">{authLabel.login[lang]}</RouterNavLink>
              <RouterNavLink to="/user-register" className="text-sm font-medium hover:text-gray-600">{authLabel.signup[lang]}</RouterNavLink>
            </div>
          )}
        </div>
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
  profileImg,
}: {
  onClick: () => void;
  show: boolean;
  popup: JSX.Element;
  icon?: React.ElementType;
  count?: number;
  profileImg?: boolean;
}) => (
  <div className="popup-container relative">
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="flex items-center space-x-2"
    >
      {profileImg ? (
        <img className="h-8 w-8 rounded-full" src={profileImage} alt="Profile" />
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

export default Navbar;
