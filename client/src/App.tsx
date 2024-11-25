import { ApolloProvider } from "@apollo/client";
import client from "./service/instance";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GuideRegister from "./ui/common/organisms/GuideRegister";
import { Route } from "./components/route";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Route />,
      children: [
        {
          path: "guide-register",
          element: <GuideRegister />,
        },
      ],
    },
  ]);
  return (
    <>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
      </ApolloProvider>
    </>
  );
}

export default App;
