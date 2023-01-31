import { async } from "@firebase/util";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { userAtom } from "../atoms";
import { firebaseDB, firebaseStorage } from "../firebase";
import { ITweetForm, ITweetObject } from "../routes/Home";

export default function Tweet({
  text,
  creatorId,
  id,
  attachmentUrl,
}: ITweetObject) {
  const user = useRecoilValue(userAtom);
  const isOwner = user?.uid === creatorId;
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

  //   const onUpdateClick = async () => {
  //     await updateDoc(doc(firebaseDB,"tweets", id),{text})
  //   }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ITweetForm>();

  const onSubmit = async ({ text }: ITweetForm) => {
    await updateDoc(doc(firebaseDB, "tweets", id), {
      text,
    });
    reset();
    setEditing(false);
  };

  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };

  return (
    <li>
      {attachmentUrl && <img src={attachmentUrl} width={100} />}
      {editing ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            defaultValue={text}
            {...register("text", { required: true, maxLength: 150 })}
          />
          <input type="submit" />
        </form>
      ) : (
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