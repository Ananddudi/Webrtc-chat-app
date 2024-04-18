import React, { useEffect, useRef } from "react";
import "./webrtc.css";
import axiosapi from "../services/api";
import { rtchandshake, socket } from "../services/socket";
import VideoWrappers from "../components/videowrappers";
import { getMediaAndPeers } from "../utils/getMediaPeers";

/// THIS SERVICE IS TEMP UNAVAILABLE ONLY WORKS AT FIRST TIME SO COMMMENTED OUT FOR NOW
// async function setCamera(selectedCameras) {
//   try {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: {
//         facingMode: selectedCameras,
//       },
//     });
//     const [videoTrack] = stream.getVideoTracks();
//     localVidRef.current.srcObject = stream;
//     const sender = peerConnection.current
//       .getSenders()
//       .find((s) => s.track.kind === videoTrack.kind);
//     sender.replaceTrack(videoTrack);
//   } catch (error) {
//     console.log("Error occured while changing camera", error.message);
//   }
// }

const CallerWebRTC = ({ reciever, closeRtc }) => {
  const remoteVidRef = useRef();
  const localVidRef = useRef();
  const peerConnection = useRef();

  const endCall = () => {
    peerConnection.current.close();
    closeRtc(reciever);
  };

  useEffect(() => {
    try {
      const initiateConnection = async () => {
        await getMediaAndPeers({
          peerConnection,
          localVidRef,
          remoteVidRef,
          reciever,
        });
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        rtchandshake("addOffer", reciever, offer);
      };

      const handleIceCandidate = ({ iceCandidate }) => {
        if (peerConnection.current) {
          if (peerConnection.current.signalingState !== "closed") {
            peerConnection.current.addIceCandidate(iceCandidate);
          }
        }
      };
      const handleOffer = async ({ offer }) => {
        await peerConnection.current.setRemoteDescription(offer);
      };

      initiateConnection();
      axiosapi.success("We are connecting please wait", "", 2);
      socket.on("recieve-ice-candidate", handleIceCandidate);
      socket.on("recieve-remote-offer", handleOffer);
      return () => {
        socket.off("recieve-ice-candidate", handleIceCandidate);
        socket.off("recieve-remote-offer", handleOffer);
        if (peerConnection?.current) {
          peerConnection.current.close();
          peerConnection.current.getSenders().forEach((sender) => {
            sender.track.stop();
          });
        }
      };
    } catch (error) {
      console.log("Error occure while connecting", error.message);
    }
  }, []);

  return (
    <VideoWrappers
      localVidRef={localVidRef}
      remoteVidRef={remoteVidRef}
      endCall={endCall}
      // setCamera={setCamera}
    />
  );
};

export default CallerWebRTC;
