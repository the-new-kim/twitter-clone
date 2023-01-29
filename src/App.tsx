import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { loginStateAtom } from "./atom";
import { fbAuth } from "./firebase";
import Router from "./router";

function App() {
  const [fbInit, setFbInit] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loginStateAtom);

  useEffect(() => {
    onAuthStateChanged(fbAuth, (user) => {
      setIsLoggedIn(user ? true : false);
      setFbInit(true);
    });
  }, []);

  console.log("LOGGEDIN:::", isLoggedIn);

  return (
    <>
      {fbInit ? <Router isLoggedIn={isLoggedIn} /> : <div>Init...</div>}
      <footer>Footer!</footer>
    </>
  );
}

export default App;
