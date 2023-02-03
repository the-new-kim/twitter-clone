import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { meAtom } from "./atoms";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";

export default function Layout() {
  const me = useRecoilValue(meAtom);

  return (
    <>
      {me && <Navigation />}
      <Suspense>
        <Outlet />
      </Suspense>
      <Footer />
    </>
  );
}
