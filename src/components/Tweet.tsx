import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { meAtom } from "../atoms";
import { firebaseDB, firebaseStorage } from "../firebase";
import { ITweetForm, ITweetObject } from "../routes/Home";
import TweetForm from "./TweetForm";

export default function Tweet({
  text,
  creatorId,
  id,
  attachmentUrl,
}: ITweetObject) {
  const me = useRecoilValue(meAtom);
  const isOwner = me?.uid === creatorId;
  const [editing, setEditing] = useState(false);

  const onDeleteClick = async () => {
    const ok = window.confirm("Sure?");
    if (!ok) return;

    await deleteDoc(doc(firebaseDB, "tweets", id));
    if (attachmentUrl) {
      const attachmentRef = ref(firebaseStorage, attachmentUrl);
      await deleteObject(attachmentRef);
    }
  };

  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };

  return (
    <li>
      {!editing && attachmentUrl && <img src={attachmentUrl} width={100} />}
      {editing ? (
        <TweetForm defaultValue={{ text, id, attachmentUrl, setEditing }} />
      ) : (
        // <form onSubmit={handleSubmit(onSubmit)}>
        //   <input
        //     type="text"
        //     defaultValue={text}
        //     {...register("text", { required: true, maxLength: 150 })}
        //   />
        //   <input type="submit" />
        // </form>
        text
      )}
      <div>
        {isOwner && (
          <>
            <button onClick={onDeleteClick}>Delete</button>
            <button onClick={toggleEditing}>
              {editing ? "Cancel" : "Edit"}
            </button>
          </>
        )}
      </div>
    </li>
  );
}
