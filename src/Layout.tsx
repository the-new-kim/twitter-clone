import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAtom } from "./atoms";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";

export default function Layout() {
  const user = useRecoilValue(userAtom);

  return (
    <>
      {user?.uid && <Navigation />}
      <Suspense>
        <Outlet />
      </Suspense>
      <Footer />
    </>
  );
}
