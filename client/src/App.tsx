import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GuideRegister from "./ui/common/organisms/GuideRegister";
import { Route } from "./components/route";
import UserRegister from "./ui/common/organisms/UserRegister";
import UserLogin from "./ui/common/organisms/UserLogin";
import Guides from "./ui/common/organisms/Guides";
import UserHome from "./ui/pages/UserHome";
import { MessageProvider } from "./contexts/MessageContext";
import Landing from "./components/LandingPage";
import { getCookie } from "./function/GetCookie";
import AdminLogin from "./ui/common/organisms/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import { Provider } from "./components/ui/provider";
import Travels from "./components/Travels";
import ToastNotification from "./components/ToastNotification";
import TravelBookingHistory from "./components/TravelBookingHistory";
import TravelBooking from "./components/TravelBooking";
import Booking from "./ui/common/organisms/Booking";
import GuideBooking from "./components/GuideBooking";
import GuideLogin from "../../providers/src/ui/organisms/GuideLogin";
import GuideHome from "./ui/common/organisms/GuideHome";
import UserProfile from "./components/UserProfile";

function App() {
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
        {
          path: "/",
          element: <ProtectedRoute />,
          children: [
            { path: "home", element: <UserHome /> },
            {
              path: "travel",
              element: <Travels />,
            },
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

  return (
    <MessageProvider>
      <ToastNotification />
      <RouterProvider router={router} />
    </MessageProvider>
  );
}

export default App;
