import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GuideRegister from "./ui/organisms/GuideRegister";
import { Route } from "./components/route";
import { MessageProvider } from "./contexts/MessageContext";
import TravelRegister from "./ui/organisms/TravelRegister";
import Landing from "./ui/pages/LandingPage";
import { getCookie } from "./function/GetCookie";
import GuideProtectedRoute from "./components/GuideProtectedRoute";
import TravelProtectedRoute from "./components/TravelProtectedRoute";
import ToastNotification from "./components/ToastNotification";
import GuideLogin from "./ui/organisms/GuideLogin";
import GuideHome from "./ui/organisms/GuideHome";
import GuideRequests from "./ui/organisms/GuidesRequests";
import GuideHistory from "./ui/organisms/GuideHistory";
import GuideProfile from "./components/GuideProfile";
import TravelLogin from "./ui/organisms/TravelLogin";
import TravelHome from "./ui/organisms/TravelHome";
import TravelProfilePopup from "./components/TravelProfilePopup";
import TravelProfile from "./components/TravelProfile";
import TravelRequests from "./ui/organisms/TravelRequests";
import TravelHistory from "./ui/organisms/TravelHistory";
import { LocationProvider } from "./contexts/LocationContext";

function App() {
  const isLoggedIn = !!getCookie("accessToken");
  const home = isLoggedIn ? <GuideHome /> : <Landing />;

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Route />,
      children: [
        { path: "", element: home },
        { path: "guide-register", element: <GuideRegister /> },
        { path: "guide-login", element: <GuideLogin /> },
        { path: "travel-login", element: <TravelLogin /> },
        { path: "travel-register", element: <TravelRegister /> },
        {
          path: "guide",
          element: <GuideProtectedRoute />,
          children: [
            { path: "home", element: <GuideHome /> },
            { path: "booking", element: <GuideRequests /> },
            { path: "history", element: <GuideHistory /> },
            { path: "profile", element: <GuideProfile /> },
          ],
        },
        {
          path: "travel",
          element: <TravelProtectedRoute />,
          children: [
            { path: "home", element: <TravelHome /> },
            { path: "booking", element: <TravelRequests /> },
            { path: "profile", element: <TravelProfile /> },
            { path: "history", element: <TravelHistory /> },
          ],
        },
      ],
    },
  ]);

  return (
    <LocationProvider>
      <ToastNotification />
      <RouterProvider router={router} />
    </LocationProvider>
  );
}

export default App;
