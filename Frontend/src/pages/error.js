import { Link } from "react-router-dom";
import "./error.css";
function Error() {
  return (
    <div className="errorpage">
      <h1>404</h1>
      <p>The page you looking for is not available</p>
      <Link to="/">
        <button className="commonBtn">Back to home</button>
      </Link>
    </div>
  );
}

export default Error;
