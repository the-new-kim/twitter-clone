import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import AuthForm from "../components/AuthForm";
import { firebaseAuth } from "../firebase";

export default function Auth() {
  const onSocialClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = event.target as HTMLButtonElement;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    }

    if (!provider) return;

    await signInWithPopup(firebaseAuth, provider);
  };

  return (
    <div>
      <AuthForm />
      <button onClick={onSocialClick} name="google">
        Google Login
      </button>
      <button onClick={onSocialClick} name="github">
        Github Login
      </button>
    </div>
  );
}
