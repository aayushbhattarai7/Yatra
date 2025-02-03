import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GuideRegister from "./ui/common/organisms/GuideRegister";
import { Route } from "./components/route";
import UserRegister from "./ui/common/organisms/UserRegister";
import UserLogin from "./ui/common/organisms/UserLogin";
import Guides from "./ui/common/organisms/Guides";
import UserHome from "./ui/pages/UserHome";
import { MessageProvider } from "./contexts/MessageContext";
import TravelRegister from "./ui/common/organisms/TravelRegister";
import Landing from "./components/LandingPage";
import { getCookie } from "./function/GetCookie";
import AdminLogin from "./ui/common/organisms/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute"; 
import { Provider } from "./components/ui/provider";
import Travels from "./components/Travels";
import ToastNotification from "./components/ToastNotification";
import TravelBookingHistory from "./components/TravelBookingHistory";
import TravelBooking from "./components/TravelBooking";

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
        { path: "guide-register", element: <GuideRegister /> },
        { path: "travel-register", element: <TravelRegister /> },
        { path: "adminLogin", element: <AdminLogin /> },
        {
          path: "/",
          element: <ProtectedRoute />, 
          children: [{ path: "home", element: <UserHome /> },
            {
              path: 'travel',
              element:<Travels/>
            },
            { path: "guide", element: <Guides /> },
            {path:'/booking', element: <TravelBooking/>},
            {path:'/history', element: <TravelBookingHistory/>}
          ],

        },
      ],
    },
  ]);

  return (
    <MessageProvider>
<ToastNotification/>
      <RouterProvider router={router} />
    </MessageProvider>
  );
}

export default App;
