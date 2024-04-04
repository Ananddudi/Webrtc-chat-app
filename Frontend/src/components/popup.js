import React from "react";
import PopupImage from "../statics/popupimage.svg";
import { Link } from "react-router-dom";

const Popup = ({ setShowpopup }) => {
  return (
    <div className="popupBackground">
      <div className="popupMain">
        <img src={PopupImage} alt="p-image" className="popupImage" />
        <div className="popupText">
          Click okay to visit <h4> The Creator </h4>of this page
        </div>
        <div className="profileBtnpos">
          <Link to="/profile">
            <button
              onClick={() => setShowpopup(false)}
              className="commonBtn profilebtn"
            >
              <b>Okay</b>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Popup;
