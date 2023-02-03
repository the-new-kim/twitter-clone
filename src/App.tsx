import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { IMe, meAtom } from "./atoms";
import { firebaseAuth } from "./firebase";
import Router from "./router";

function App() {
  const [firebaseInit, setFirebaseInit] = useState(false);

  const setMe = useSetRecoilState(meAtom);

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        const userCopy = JSON.parse(JSON.stringify(user)) as User; //https://github.com/firebase/firebase-js-sdk/issues/5722 📝 Firebase Recoil Issue...

        const me: IMe = {
          uid: userCopy.uid,
          displayName: userCopy.displayName,
          photoURL: userCopy.photoURL,
          email: userCopy.email,
          phoneNumber: userCopy.phoneNumber,
        };

        setMe(me);
      } else {
        setMe(null);
      }

      setFirebaseInit(true);
    });
  }, []);

  return <>{firebaseInit ? <Router /> : <div>Init...</div>}</>;
}

export default App;
