import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GuideRegister from "./ui/common/organisms/GuideRegister";
import { Route } from "./components/route";
import UserRegister from "./ui/common/organisms/Register";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Route />,
      children: [
        {
          path: '/register',
          element:<UserRegister/>
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
        <RouterProvider router={router} />
    </>
  );
}

export default App;
