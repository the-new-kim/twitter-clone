import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { loginStateAtom } from "./atom";
import Navigation from "./components/Navigation";

export default function Layout() {
  const loggedIn = useRecoilValue(loginStateAtom);

  return (
    <>
      {loggedIn && <Navigation />}
      <Suspense>
        <Outlet />
      </Suspense>
    </>
  );
}
