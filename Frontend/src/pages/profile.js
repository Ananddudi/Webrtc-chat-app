import { useState, useEffect, lazy } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.css";
const Content = lazy(() => import("../components/content"));

const MyProfile = () => {
  const [showcontent, setShowcontent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let id = setTimeout(() => {
      setShowcontent(true);
    }, 8000);

    return () => clearInterval(id);
  }, []);

  return (
    <section className="profilePage">
      <div onClick={() => navigate("/")} className="profileBackButton">
        <span>Back</span>
      </div>
      <Content showcontent={showcontent} />
    </section>
  );
};

export default MyProfile;
