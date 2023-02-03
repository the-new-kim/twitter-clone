import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { meAtom } from "../atoms";
import { firebaseDB, firebaseStorage } from "../firebase";
import { ITweetForm } from "../routes/Home";
import { v4 as uuidv4 } from "uuid";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";

interface ITweetFormProps {
  defaultValue?: {
    text: string;
    id: string;
    attachmentUrl: string | null;
    setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

export default function TweetForm({ defaultValue }: ITweetFormProps) {
  if (defaultValue) {
    console.log("DEFAULT VL::::", defaultValue);
  }

  const me = useRecoilValue(meAtom);
  const [attachment, setAttachment] = useState<string | null>(
    defaultValue?.attachmentUrl || null
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ITweetForm>();

  const onSubmit = async ({ text }: ITweetForm) => {
    if (!me?.uid) return;

    let attachmentUrl = attachment;

    // attachment
    // !defaultValue
    // !defaultValue.attachmentUrl
    // defaultValue && attachment === defaultValue.attachmentUrl

    // CHECK ALSO IF ATTACHMENT IS FROM STORAGE
    if (attachment && !attachment.includes("https://")) {
      const fileRef = ref(firebaseStorage, `${me.uid}/${uuidv4()}`);

      try {
        const response = await uploadString(fileRef, attachment, "data_url");
        attachmentUrl = await getDownloadURL(response.ref);
      } catch (error) {
        console.log("ERROR:::", error);
      }
    }

    //NEW TWEET

    if (!defaultValue) {
      console.log("SET NEW TWEET");
      await addDoc(collection(firebaseDB, "tweets"), {
        text,
        createdAt: Date.now(),
        creatorId: me.uid,
        attachmentUrl,
      });
      setAttachment(null);
      reset();
    } else {
      //EDIT TWEET
      console.log("EDIT TWEET");

      if (
        (defaultValue.attachmentUrl !== attachment &&
          defaultValue.attachmentUrl !== null) ||
        (defaultValue.attachmentUrl && !attachment)
      ) {
        // delete old attachment from Storage

        const attachmentRef = ref(firebaseStorage, defaultValue.attachmentUrl);
        await deleteObject(attachmentRef);
      }

      await updateDoc(doc(firebaseDB, "tweets", defaultValue.id), {
        text,
        attachmentUrl,
      });
      reset();
      defaultValue.setEditing(false);
    }
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
    <>
      {attachment && (
        <div>
          <img width={100} src={attachment} />
          <button onClick={onClearAttachment}>Clear</button>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          defaultValue={defaultValue?.text || ""}
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
    </>
  );
}
