import { async } from "@firebase/util";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { fbAuth } from "../firebase";

interface IAuthForm {
  email: string;
  password: string;
}

export default function Auth() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAuthForm>();

  const [newAccount, setNewAccount] = useState(true);

  const onSubmit = async ({ email, password }: IAuthForm) => {
    try {
      if (newAccount) {
        await createUserWithEmailAndPassword(fbAuth, email, password);
      } else {
        await signInWithEmailAndPassword(fbAuth, email, password);
      }
    } catch (error) {
      console.log("ERROR:::", error);
    }
  };

  const toggleAccount = () => setNewAccount((prev) => !prev);

  const onSocialClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = event.target as HTMLButtonElement;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    }

    if (!provider) return;

    const reault = await signInWithPopup(fbAuth, provider);
    console.log(reault);
  };

  return (
    <div>
      <h1>AUTH</h1>
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

      <button onClick={onSocialClick} name="google">
        Google Login
      </button>
      <button onClick={onSocialClick} name="github">
        Github Login
      </button>
    </div>
  );
}
