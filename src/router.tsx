import { useState } from "react";
import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import Navigation from "./components/Navigation";
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

interface IRouterProps {
  isLoggedIn: boolean;
}

export default function Router({ isLoggedIn }: IRouterProps) {
  return (
    <>
      <RouterProvider router={router(isLoggedIn)} />
    </>
  );
}
