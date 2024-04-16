import { FaBars } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useContenctHook } from "../context/contextapi";
import UploadImage from "./upload";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axiosapi from "../services/api";

const AuthMenu = () => {
  const { auth } = useContenctHook();
  const navigate = useNavigate();

  console.log("prints");

  const handleFeedback = (e) => {
    if (auth) {
      navigate("/feedback");
    } else {
      axiosapi.error("Please sign up!");
    }
  };

  return (
    <ul className="headerList">
      <li>
        <div>
          <img
            src={
              auth?.profilepic
                ? auth.profilepic
                : require("../statics/profileImage.jpg")
            }
            alt="upload-preview-img"
            className="upload-preview-img"
          />
        </div>
        <div>{auth ? auth.fullname : "No user"}</div>
      </li>
      <li>
        <UploadImage />
      </li>
      <li>
        <button onClick={(e) => handleFeedback(e)}>Feedback</button>
        <div>
          <MdKeyboardDoubleArrowRight className="feedback-icon" />
        </div>
      </li>
    </ul>
  );
};

export const ChatHeader = () => {
  const [showlist, setShowlist] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        !event.target.closest(".headerList") &&
        !event.target.closest(".headerbar")
      ) {
        if (showlist) setShowlist(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [showlist]);

  return (
    <div className="headerSection">
      <div className="header">
        <button
          className="headerBtn"
          onClick={(e) => {
            e.stopPropagation();
            setShowlist(!showlist);
          }}
        >
          <FaBars />
        </button>
        <div className="headerBarText">
          <span>Chat Section</span>
        </div>
      </div>
      {showlist && <AuthMenu />}
    </div>
  );
};

export default ChatHeader;
