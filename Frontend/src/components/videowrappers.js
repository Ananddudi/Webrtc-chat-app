import React, { useState } from "react";
import { FcEndCall } from "react-icons/fc";
import { MdFlipCameraIos } from "react-icons/md";
import { BsBack } from "react-icons/bs";

const VideoWrappers = React.forwardRef(
  ({ localVidRef, remoteVidRef, endCall, changeCMode }, ref) => {
    const [changeDisplay, setChangeDisplay] = useState(false);
    return (
      <>
        <div className="videoWrappers">
          <video
            className={
              changeDisplay ? "local-video-player" : "remote-video-player"
            }
            id="remote-video"
            ref={remoteVidRef}
            autoPlay
          ></video>
          <video
            className={
              changeDisplay ? "remote-video-player" : "local-video-player"
            }
            id="local-video"
            autoPlay
            ref={localVidRef}
          ></video>
          <div className="live-btns">
            <button className="end-call" onClick={() => endCall()}>
              <FcEndCall className="end-icon" />
            </button>
            <button className="camera-mode" onClick={() => changeCMode()}>
              <MdFlipCameraIos className="camera-mode-icon" />
            </button>
            <button
              className="camera-mode"
              onClick={() => setChangeDisplay(!changeDisplay)}
            >
              <BsBack className="camera-mode-icon" />
            </button>
          </div>
        </div>
      </>
    );
  }
);

export default VideoWrappers;
