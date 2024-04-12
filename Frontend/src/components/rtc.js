import React, { useEffect, useRef } from "react";
import "./webrtc.css";
import { useContenctHook } from "../context/contextapi";
import axiosapi from "../services/api";
import { socket } from "../services/socket";
import VideoWrappers from "../components/videowrappers";
import profileImage from "../statics/profileImage.jpg";
import { IoCall } from "react-icons/io5";
import { MdCallEnd } from "react-icons/md";

const WebRTC = () => {
  const { auth, callMode, setCallMode } = useContenctHook();
  const remoteVidRef = useRef();
  const localVidRef = useRef();
  const peerConnection = useRef();
  const changeCameraMode = useRef("environment");

  const changeCMode = async () => {
    if (changeCameraMode.current == "environment") {
      let localStreams = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        // audio:true
      });

      localVidRef.current.srcObject = localStreams;
      localStreams.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, localStreams);
      });
      const [videoTrack] = localStreams.getVideoTracks();
      const sender = peerConnection.current
        .getSenders()
        .find((s) => s.track.kind === videoTrack.kind);
      console.log("Found sender:", sender);
      sender.replaceTrack(videoTrack);
    }
    if (changeCameraMode.current == "user") {
      changeCameraMode.current = "environment";
      return;
    }
  };

  const getMediaAndPeers = async (cameraMode) => {
    let localStreams = null;
    let remoteStream = null;
    localStreams = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: cameraMode },
      // audio:true
    });

    localVidRef.current.srcObject = localStreams;

    remoteStream = new MediaStream();
    remoteVidRef.current.srcObject = remoteStream;

    peerConnection.current = await new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
          ],
        },
      ],
    });

    localStreams.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, localStreams);
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("ice candidate is", event.candidate, {
          sender: auth.email,
          reciever: callMode.data.email,
          iceCandidate: event.candidate,
        });
        socket.emit("add-ice-candidate", {
          reciever: callMode.data.email,
          iceCandidate: event.candidate,
        });
      } else {
        console.log("Oops: No ice candidate found!");
      }
    };

    peerConnection.current.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track, remoteStream);
      });
    };
  };

  const endCall = (mode = "response") => {
    console.log("callmode", callMode);
    setCallMode({
      mode: "",
      data: {},
    });
    if (mode == "response") {
      socket.emit("close-connection", { reciever: callMode.data.email });
    } else {
      if (Object.keys(callMode.data).length !== 0) {
        axiosapi.success(
          `${
            callMode.data.fullname ? callMode.data.fullname : "Other user"
          } has disconnect the call!`
        );
      }
    }
  };

  useEffect(() => {
    const addOffer = (offer) => {
      socket.emit("add-offer", {
        reciever: callMode.data.email,
        offer,
      });
    };

    const handleConnection = async () => {
      await getMediaAndPeers("environment");
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      addOffer(offer);
    };

    const handleIceCandidate = ({ iceCandidate }) => {
      if (peerConnection.current) {
        if (peerConnection.current.signalingState !== "closed") {
          peerConnection.current.addIceCandidate(iceCandidate);
        }
      }
    };

    //In case other use got disconnected
    const userOffline = (email) => {
      if (callMode.data.email === email) {
        endCall("request");
      }
    };

    const handleOffer = async ({ offer }) => {
      if (callMode.mode == "answer") {
        await getMediaAndPeers("environment");
        await peerConnection.current.setRemoteDescription(offer);
        const answerOffer = await peerConnection.current.createAnswer({});
        await peerConnection.current.setLocalDescription(answerOffer);
        addOffer(answerOffer);
      } else if (callMode.mode == "call") {
        await peerConnection.current.setRemoteDescription(offer);
      }
    };

    if (callMode.mode !== "" && callMode.mode !== "hold") {
      axiosapi.success("We are connecting", "", 5);
      if (callMode.mode == "call") {
        socket.on("connection-status", handleConnection);
      }
      socket.on("recieve-ice-candidate", handleIceCandidate);
      socket.on("recieve-offer", handleOffer);
    }

    socket.on("close-connection-request", () => endCall("request"));
    socket.on("offline-status", userOffline);
    return () => {
      if (callMode.mode !== "" || callMode.mode !== "hold") {
        socket.off("offline-status", userOffline);
        socket.off("close-connection-request", handleOffer);
        socket.off("connection-status", handleConnection);
        socket.off("recieve-ice-candidate", handleIceCandidate);
        socket.off("recieve-offer", handleOffer);
        if (peerConnection?.current) {
          peerConnection.current.close();
          peerConnection.current.getSenders().forEach((sender) => {
            sender.track.stop();
          });
          socket.emit("close-connection", { reciever: callMode.data.email });
        }
      }
    };
  }, [callMode]);

  return (
    <div className={`live-video-page ${callMode.mode !== "" && "show"}`}>
      {callMode.mode === "hold" ? (
        <section className="call-info">
          <div className="image-name">
            <img
              src={
                callMode?.data?.profilepic
                  ? callMode?.data?.profilepic
                  : profileImage
              }
              alt="profileImage-caller"
              className="caller-profile-img"
            />
            <div className="caller-name">
              {callMode?.data?.fullname ? callMode.data.fullname : "Unknown"}
            </div>
          </div>
          <div className="response-btn">
            <button
              className="pick-btn"
              onClick={() => {
                socket.emit("connection-accepted", {
                  reciever: callMode.data.email,
                });
                setCallMode((prev) => ({ ...prev, mode: "answer" }));
              }}
            >
              <IoCall className="icon" />
            </button>
            <button className="drop-btn" onClick={() => endCall("response")}>
              <MdCallEnd className="icon" />
            </button>
          </div>
        </section>
      ) : (
        <VideoWrappers
          localVidRef={localVidRef}
          remoteVidRef={remoteVidRef}
          endCall={() => endCall("response")}
          changeCMode={changeCMode}
        />
      )}
    </div>
  );
};

export default WebRTC;
