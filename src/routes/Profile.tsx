import { signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { meAtom } from "../atoms";
import Tweet from "../components/Tweet";
import { firebaseAuth, firebaseDB } from "../firebase";
import { ITweetObject } from "./Home";
import { updateProfile } from "firebase/auth";

interface IUserProfileForm {
  displayName: string;
}

export default function Profile() {
  const [tweets, setTweets] = useState<ITweetObject[]>([]);
  const [me, setMe] = useRecoilState(meAtom);
  const navigage = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUserProfileForm>();

  const onLogoutClick = () => {
    signOut(firebaseAuth);
    navigage("/");
  };

  const getMyTweets = async () => {
    const q = query(
      collection(firebaseDB, "tweets"),
      where("creatorId", "==", me?.uid),
      orderBy("createdAt", "desc")
    );

    try {
      const querySnapshot = await getDocs(q);

      const myTweets = querySnapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
        } as ITweetObject;
      });
      setTweets(myTweets);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMyTweets();

    const q = query(
      collection(firebaseDB, "tweets"),
      where("creatorId", "==", me?.uid),
      orderBy("createdAt", "desc")
    );

    onSnapshot(q, {
      next: (snapshot) => {
        let newTweets = snapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          } as ITweetObject;
        });

        setTweets(newTweets);
      },
    });
  }, []);

  const onEditProfile = async ({ displayName }: IUserProfileForm) => {
    if (displayName === me?.displayName || !firebaseAuth.currentUser) return;

    await updateProfile(firebaseAuth.currentUser, {
      displayName,
    });

    const { currentUser } = firebaseAuth;

    setMe({
      displayName: currentUser.displayName,
      email: currentUser.email,
      phoneNumber: currentUser.phoneNumber,
      photoURL: currentUser.photoURL,
      uid: currentUser.uid,
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onEditProfile)}>
        <input
          type="text"
          defaultValue={me?.displayName || ""}
          {...register("displayName", { required: true, minLength: 3 })}
        />
        <input type="file" accept="image/*" />
        <input type="submit" />
      </form>

      <h1>My Tweets</h1>
      <ul>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </ul>
      <button onClick={onLogoutClick}>Logout</button>
    </div>
  );
}
