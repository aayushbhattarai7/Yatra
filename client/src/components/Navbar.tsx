import { Bell, MessageSquare, Menu, X } from "lucide-react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import NotificationsPopup from "./NotificationPopup";
import ChatPopup from "./ChatPopup";
import ProfilePopup from "./ProfilePopup";
import { getCookie } from "@/function/GetCookie";
import { jwtDecode } from "jwt-decode";
import { gql, useQuery } from "@apollo/client";
import { GET_USER_CHAT_COUNT, GET_USER_NOTIFICATIONS } from "@/mutation/queries";
import { useSocket } from "@/contexts/SocketContext";
import { useLang } from "@/hooks/useLang";
import { authLabel } from "@/localization/auth";

interface FormData {
  id: string;
  image: Image[];
}

interface Image {
  id: string;
  path: string;
  type: string;
}

const GET_USER_QUERY = gql`
  query GetUser {
    getUser {
      id
      image {
        id
        path
        type
      }
    }
  }
`;

interface Notifications {
  id: string;
  isRead: boolean;
}

const Navbar = () => {
  const { socket } = useSocket();
  const { lang } = useLang();
  const token = getCookie("accessToken")!;
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatCount, setChatCount] = useState<number>(0);
  const [user, setUser] = useState<FormData | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notifications, setNotifications] = useState<Notifications[]>([]);

  const { data: notificationData } = useQuery(GET_USER_NOTIFICATIONS);
  const { data: chatData, refetch } = useQuery(GET_USER_CHAT_COUNT);
  const { data: userData } = useQuery(GET_USER_QUERY);

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
    if (userData?.getUser) {
      setUser(userData.getUser);
    }
  }, [userData]);

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

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<{ id: string; email: string }>(token);
        setIsLoggedIn(!!decoded);
      } catch {
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

  const profileImgSrc = user?.image?.[1]?.path || "/default-profile.png";

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
            <NavLink to="/" label={authLabel.home[lang]} />
            <NavLink to="/places" label={authLabel.place[lang]} />
            <NavLink to="/travel" label={authLabel.travel[lang]} />
            <NavLink to="/guide" label={authLabel.guide[lang]} />
            <NavLink to="/booking" label={authLabel.booking[lang]} />
            <NavLink to="/history" label={authLabel.history[lang]} />
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
              />
              <PopupButton
                onClick={openProfile}
                show={showProfile}
                popup={<ProfilePopup onClose={() => setShowProfile(false)} />}
                profileImgSrc={profileImgSrc}
              />
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-6">
              <NavLink to="/user-login" label={authLabel.login[lang]} />
              <NavLink to="/user-register" label={authLabel.signup[lang]} />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

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

const PopupButton = ({
  onClick,
  show,
  popup,
  icon: Icon,
  count,
  profileImgSrc,
}: {
  onClick: () => void;
  show: boolean;
  popup: JSX.Element;
  icon?: React.ElementType;
  count?: number;
  profileImgSrc?: string;
}) => (
  <div className="popup-container relative">
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="flex items-center space-x-2"
    >
      {profileImgSrc ? (
        <img className="h-8 w-8 rounded-full" src={profileImgSrc} alt="Profile" />
      ) : (
        Icon && <NotificationIcon icon={Icon} count={count || 0} />
      )}
    </button>
    {show && popup}
  </div>
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

interface NotificationIconProps {
  icon: React.ElementType;
  count: number;
}

export default Navbar;
