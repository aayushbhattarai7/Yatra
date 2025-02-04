import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GuideRegister from "./ui/organisms/GuideRegister";
import { Route } from "./components/route";

import { MessageProvider } from "./contexts/MessageContext";
import TravelRegister from "./ui/organisms/TravelRegister";
import Landing from "./ui/pages/LandingPage";
import { getCookie } from "./function/GetCookie";
import ProtectedRoute from "./components/ProtectedRoute";
import ToastNotification from "./components/ToastNotification";
import GuideLogin from "../../providers/src/ui/organisms/GuideLogin";
import GuideHome from "./ui/organisms/GuideHome";
import GuideRequests from "./ui/organisms/GuidesRequests";


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
        { path: "travel-register", element: <TravelRegister /> },
        {
          path: "/",
          element: <ProtectedRoute />,
          children: [
            { path: "home", element: <GuideHome /> },
           
         
            { path: "guide-home", element: <GuideHome /> },
            { path: "booking", element: <GuideRequests /> },
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
