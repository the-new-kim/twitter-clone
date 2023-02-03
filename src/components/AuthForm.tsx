import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { meAtom } from "../atoms";
import { firebaseAuth } from "../firebase";

interface IAuthForm {
  email: string;
  password: string;
}

export default function AuthForm() {
  const setMe = useSetRecoilState(meAtom);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAuthForm>();

  const onSubmit = async ({ email, password }: IAuthForm) => {
    try {
      if (newAccount) {
        await createUserWithEmailAndPassword(firebaseAuth, email, password);
      } else {
        await signInWithEmailAndPassword(firebaseAuth, email, password);
      }
    } catch (error) {
      console.log("ERROR:::", error);
    }
    if (firebaseAuth.currentUser)
      setMe({
        uid: firebaseAuth.currentUser!.uid,
        displayName: firebaseAuth.currentUser!.displayName || "Anonym",
        email,
        phoneNumber: firebaseAuth.currentUser!.phoneNumber,
        photoURL: firebaseAuth.currentUser!.photoURL,
      });
  };

  const [newAccount, setNewAccount] = useState(true);

  const toggleAccount = () => setNewAccount((prev) => !prev);

  return (
    <>
      <button onClick={toggleAccount}>
        {newAccount ? "sign in" : "create account"}
      </button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="email" {...register("email", { required: true })} />
        <input type="password" {...register("password", { required: true })} />
        <input
          type="submit"
          value={newAccount ? "create account" : "sign in"}
        />
      </form>
    </>
  );
}
