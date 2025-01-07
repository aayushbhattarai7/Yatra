import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GuideRegister from "./ui/common/organisms/GuideRegister";
import { Route } from "./components/route";
import UserRegister from "./ui/common/organisms/Register";
import UserLogin from "./ui/common/organisms/UserLogin";
import Guides from "./ui/common/organisms/Guides";
import UserHome from "./ui/pages/UserHome";
import { MessageProvider } from "./contexts/MessageContext";

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
          path: "/register",
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
