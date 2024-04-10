import React from "react";
import { FcEndCall } from "react-icons/fc";

const VideoWrappers = React.forwardRef(
  ({ localVidRef, remoteVidRef, endCall }, ref) => {
    return (
      <>
        <div className="videoWrappers">
          <video
            className="remote-video-player"
            id="remote-video"
            ref={remoteVidRef}
            autoPlay
          ></video>
          <video
            className="local-video-player"
            id="local-video"
            autoPlay
            ref={localVidRef}
          ></video>
          <button className="end-call" onClick={() => endCall()}>
            <FcEndCall className="end-icon" />
          </button>
        </div>
      </>
    );
  }
);

export default VideoWrappers;
