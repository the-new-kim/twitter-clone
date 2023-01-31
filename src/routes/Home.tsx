import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { meAtom } from "../atoms";
import Tweet from "../components/Tweet";
import { firebaseDB, firebaseStorage } from "../firebase";
import { v4 as uuidv4 } from "uuid";

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
  const me = useRecoilValue(meAtom);
  const [tweets, setTweets] = useState<ITweetObject[]>([]);
  const [attachment, setAttachment] = useState<string | null>(null);

  const getTweets = async () => {
    const q = query(
      collection(firebaseDB, "tweets"),
      orderBy("createdAt", "asc")
    );

    try {
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const tweetObject = {
          ...doc.data(),
          id: doc.id,
        } as ITweetObject;

        setTweets((prev) => [tweetObject, ...prev]);
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getTweets();
    const q = query(
      collection(firebaseDB, "tweets"),
      orderBy("createdAt", "asc")
    );

    onSnapshot(q, {
      next: (snapshot) => {
        let newTweets: ITweetObject[] = [];

        snapshot.forEach((doc) => {
          const tweetObject = {
            ...doc.data(),
            id: doc.id,
          } as ITweetObject;

          newTweets = [tweetObject, ...newTweets];

          // console.log(tweetObject);

          // setTweets((prev) => {
          //   let newTweets = [...prev];
          //   const tweetExists = prev.find((item) => item.id === tweetObject.id);
          //   if (!tweetExists) newTweets = [tweetObject, ...newTweets];

          //   return newTweets;
          // });
        });

        setTweets(newTweets);
      },
    });
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ITweetForm>();

  const onSubmit = async ({ text }: ITweetForm) => {
    if (!me?.uid) return;

    let attachmentUrl = null;

    if (attachment) {
      const fileRef = ref(firebaseStorage, `${me.uid}/${uuidv4()}`);

      console.log("FILE REF:::", fileRef);

      try {
        const response = await uploadString(fileRef, attachment, "data_url");
        console.log(response);
        attachmentUrl = await getDownloadURL(response.ref);
      } catch (error) {
        console.log("ERROR:::", error);
      }
    }

    await addDoc(collection(firebaseDB, "tweets"), {
      text,
      createdAt: Date.now(),
      creatorId: me.uid,
      attachmentUrl,
    });
    setAttachment(null);
    reset();
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;

    if (!files) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onloadend = (finishedEvent) => {
      if (!finishedEvent.target || !finishedEvent.target.result) return;
      setAttachment(finishedEvent.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onClearAttachment = () => {
    setAttachment(null);
  };

  return (
    <div>
      {attachment && (
        <div>
          <img width={200} src={attachment} />
          <button onClick={onClearAttachment}>Clear</button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          {...register("text", { required: true, maxLength: 150 })}
        />
        <input
          type="file"
          accept="image/*"
          {...register("file")}
          onChange={onFileChange}
        />
        <input type="submit" />
      </form>

      <ul>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </ul>
    </div>
  );
}
