import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Route } from "./components/route";
import UserRegister from "./ui/common/organisms/UserRegister";
import UserLogin from "./ui/common/organisms/UserLogin";
import Guides from "./ui/common/organisms/Guides";
import UserHome from "./ui/pages/UserHome";
import Landing from "./components/LandingPage";
import { getCookie } from "./function/GetCookie";
import AdminLogin from "./ui/common/organisms/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import Travels from "./components/Travels";
import ToastNotification from "./components/ToastNotification";
import TravelBookingHistory from "./components/TravelBookingHistory";
import TravelBooking from "./components/TravelBooking";
import Booking from "./ui/common/organisms/Booking";
import GuideBooking from "./components/GuideBooking";
import GuideHome from "./ui/common/organisms/GuideHome";
import UserProfile from "./components/UserProfile";
import { StripeProvider } from "./contexts/StripeContext";
import EsewaPaymentForm from "./components/EsewaPaymentForm";
import Success from "./components/EsewaSuccess";
import Failure from "./components/EsewaFailure";
import PaymentForm from "./components/EsewaPaymentForm";
import { SocketProvider } from "./contexts/SocketContext";
import KhaltiSuccess from "./components/KhaltiSuccess";
import Chat from "./components/ui/Chat";
import { NotificationProvider } from "./contexts/NotificationContext";
import ForgotPassword from "./components/ForgotPassword";

const isLoggedIn = !!getCookie("accessToken");
const home = isLoggedIn ? <UserHome /> : <Landing />;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Route />,
    children: [
      { path: "", element: home },
      { path: "/user-register", element: <UserRegister /> },
      { path: "/user-login", element: <UserLogin /> },
      { path: "adminLogin", element: <AdminLogin /> },
      { path: "reset-password", element: <ForgotPassword /> },
      {
        path: "/",
        element: <ProtectedRoute />,
        children: [
          { path: "paymentsuccess/:type/:id", element: <Success /> },
          { path: "khaltiSuccess/:type/:id", element: <KhaltiSuccess /> },
          { path: "paymentfailure", element: <Failure /> },
          { path: "home", element: <UserHome /> },
          { path: "chat", element: <Chat /> },
          { path: "travel", element: <Travels /> },
          { path: "guide", element: <Guides /> },
          { path: "user-profile", element: <UserProfile /> },
          { path: "/booking", element: <Booking /> },
          { path: "/history", element: <TravelBookingHistory /> },
          { path: "travel-booking", element: <TravelBooking /> },
          { path: "guide-booking", element: <GuideBooking /> },
          { path: "guide-home", element: <GuideHome /> },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <>
      <SocketProvider>
        <NotificationProvider>
        <StripeProvider>
          <ToastNotification />
          <RouterProvider router={router} />
        </StripeProvider>
        </NotificationProvider>
      </SocketProvider>
    </>
  );
}

export default App;
