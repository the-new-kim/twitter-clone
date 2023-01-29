import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { fbAuth } from "../firebase";

export default function Profile() {
  const navigage = useNavigate();

  const onLogoutClick = () => {
    signOut(fbAuth);
    navigage("/");
  };

  return (
    <div>
      <button onClick={onLogoutClick}>Logout</button>
    </div>
  );
}
