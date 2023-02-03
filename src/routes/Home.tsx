import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { useEffect, useState } from "react";

import Tweet from "../components/Tweet";
import TweetForm from "../components/TweetForm";
import { firebaseDB } from "../firebase";

export interface ITweetForm {
  text: string;
  file: string;
}

export interface ITweetObject extends ITweetForm {
  id: string;
  createdAt: number;
  creatorId: string;
  attachmentUrl: string | null;
}

export default function Home() {
  const [tweets, setTweets] = useState<ITweetObject[]>([]);

  const getTweets = async () => {
    console.log("GET TWEETS...");
    const q = query(
      collection(firebaseDB, "tweets"),
      orderBy("createdAt", "desc")
    );

    try {
      const querySnapshot = await getDocs(q);

      const allTweets = querySnapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
        } as ITweetObject;
      });
      setTweets(allTweets);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getTweets();
    const q = query(
      collection(firebaseDB, "tweets"),
      orderBy("createdAt", "desc")
    );

    onSnapshot(q, {
      next: (snapshot) => {
        const newTweets = snapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          } as ITweetObject;
        });

        setTweets(newTweets);
      },
    });
  }, []);
  console.log("TWEETS::::", tweets);
  return (
    <div>
      <TweetForm />
      <ul>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </ul>
    </div>
  );
}
