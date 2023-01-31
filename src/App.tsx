import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { userAtom } from "./atoms";
import { firebaseAuth } from "./firebase";
import Router from "./router";

function App() {
  const [firebaseInit, setFirebaseInit] = useState(false);

  const setUser = useSetRecoilState(userAtom);

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      const userCopy = JSON.parse(JSON.stringify(user)); //https://github.com/firebase/firebase-js-sdk/issues/5722 📝 Firebase Recoil Issue...
      setUser(userCopy);
      setFirebaseInit(true);
    });
  }, []);

  return <>{firebaseInit ? <Router /> : <div>Init...</div>}</>;
}

export default App;
