import { User } from "firebase/auth";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { meAtom } from "./atoms";
import Layout from "./Layout";
import Auth from "./routes/Auth";
import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import Profile from "./routes/Profile";

const router = (isLoggedIn: boolean) => {
  return createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,
      children: isLoggedIn
        ? [
            {
              path: "/",
              element: <Home />,
            },
            {
              path: "/profile",
              element: <Profile />,
            },
          ]
        : [
            {
              path: "/",
              element: <Auth />,
            },
          ],
    },
  ]);
};

export default function Router() {
  const me = useRecoilValue(meAtom);

  return (
    <>
      <RouterProvider router={router(me?.uid ? true : false)} />
    </>
  );
}
