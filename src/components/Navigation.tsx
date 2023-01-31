import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { meAtom } from "../atoms";

export default function Navigation() {
  const me = useRecoilValue(meAtom);

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/profile">{me?.displayName}</Link>
        </li>
      </ul>
    </nav>
  );
}
