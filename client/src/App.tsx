import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GuideRegister from "./ui/common/organisms/GuideRegister";
import { Route } from "./components/route";
import UserRegister from "./ui/common/organisms/UserRegister";
import UserLogin from "./ui/common/organisms/UserLogin";
import Guides from "./ui/common/organisms/Guides";
import UserHome from "./ui/pages/UserHome";
import { MessageProvider } from "./contexts/MessageContext";
import TravelRegister from "./components/TravelRegister";
import { MapProvider } from "./contexts/MapContext";
import Landing from "./components/LandingPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Route />,
      children: [
        {
          path: "",
          element: <UserHome />,
        },
        {
          path: "/landing",
          element: <Landing />,
        },
        {
          path: "/user-register",
          element: <UserRegister />,
        },
        {
          path: "/user-login",
          element: <UserLogin />,
        },
        {
          path: "/guides",
          element: <Guides />,
        },
        {
          path: "guide-register",
          element: <GuideRegister />,
        },
        {
          path: "travel-register",
          element: <TravelRegister />,
        },
      ],
    },
  ]);
  return (
    <>
      <MessageProvider>

        <RouterProvider router={router} />
      </MessageProvider>
    </>
  );
}

export default App;
