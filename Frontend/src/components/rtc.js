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

  /// IT ONLY WORKS AT FIRST TIME SO COMMMENTED OUT FOR NOW
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

  const getMediaAndPeers = async () => {
    try {
      let localStreams = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
        audio: true,
      });
      localVidRef.current.srcObject = localStreams;

      let remoteStream = new MediaStream();
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
    } catch (error) {
      console.log(
        "Error occured while getting and setting media,peers",
        error.message
      );
    }
  };

  const endCall = (mode = "response") => {
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
    try {
      const addOffer = (offer) => {
        socket.emit("add-offer", {
          reciever: callMode.data.email,
          offer,
        });
      };

      const handleConnection = async () => {
        await getMediaAndPeers();
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
          await getMediaAndPeers();
          await peerConnection.current.setRemoteDescription(offer);
          const answerOffer = await peerConnection.current.createAnswer({});
          await peerConnection.current.setLocalDescription(answerOffer);
          addOffer(answerOffer);
        } else if (callMode.mode == "call") {
          await peerConnection.current.setRemoteDescription(offer);
        }
      };

      if (callMode.mode !== "" && callMode.mode !== "hold") {
        axiosapi.success("We are connecting please wait", "", 2);
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
            // socket.emit("close-connection", { reciever: callMode.data.email });
          }
        }
      };
    } catch (error) {
      console.log("Error occure while connecting", error.message);
    }
  }, [callMode]);

  return (
    <div className={`live-video-page ${callMode.mode !== "" ? "show" : ""}`}>
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
          endCall={endCall}
          // setCamera={setCamera}
        />
      )}
    </div>
  );
};

export default WebRTC;
