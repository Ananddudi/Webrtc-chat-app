import React, { useEffect, useRef } from "react";
import "./webrtc.css";
import { useContenctHook } from "../context/contextapi";
import axiosapi from "../services/api";
import { socket } from "../services/socket";

const WebRTC = ({ data }) => {
  const { setLoading, offers, auth } = useContenctHook();
  const remoteVidRef = useRef();
  const localVidRef = useRef();
  const localStream = useRef();
  const remoteStream = useRef();
  const peerConnection = useRef();

  const handleOffers = () => {
    if (offers) {
      if (
        offers &&
        offers.answererSdpOffer &&
        offers.callerEmail === auth.email
      ) {
        peerConnection.current.setRemoteDescription(offers.answererSdpOffer);
      }
    }
  };

  const handleIceCandidate = () => {
    if (offers) {
      if (
        offers &&
        offers.callerIceCandidates.length &&
        offers.callerEmail === auth.email
      ) {
        offers.callerIceCandidates.forEach((candidate) => {
          peerConnection.current.addIceCandidate(candidate);
        });
      }

      if (
        offers &&
        offers.callerIceCandidates.length &&
        offers.callerEmail === auth.email
      ) {
        offers.answererIceCandidates.forEach((candidate) => {
          peerConnection.current.addIceCandidate(candidate);
        });
      }
    }
  };

  const createOffer = async () => {
    const offer = await peerConnection.current.createOffer();
    peerConnection.current.setLocalDescription(offer);
    socket.emit("add-offer", {
      sender: auth.email,
      reciever: data.email,
      offer,
    });
  };

  const createAnswerOffer = async () => {
    const answerOffer = await peerConnection.current.createAnswer({});
    await peerConnection.current.setLocalDescription(answerOffer);
    await peerConnection.current.setRemoteDescription(offers.callerSdpOffer);
    socket.emit("add-offer", {
      sender: auth.email,
      reciever: data.email,
      offer: answerOffer,
    });
  };

  const getMediaAndPeers = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      // audio:true
    });

    localStream.current = stream;
    remoteStream.current = new MediaStream();
    localVidRef.current.srcObject = localStream.current;
    remoteVidRef.current.srcObject = remoteStream.current;

    const peerConnect = await new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
          ],
        },
      ],
    });
    peerConnection.current = peerConnect;
    localStream.current.getTracks().forEach((track) => {
      peerConnect.addTrack(track, localStream.current);
    });

    peerConnect.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("add-ice-candidate", {
          sender: auth.email,
          reciever: data.email,
          iceCandidate: event.candidate,
        });
      } else {
        console.log("Oops: No ice candidate found!");
      }
    };

    peerConnect.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.current.addTrack(track, remoteStream.current);
      });
    };

    //check if other user is available or not
    if (data.available === "n") {
      axiosapi.error("Other user is not Online");
      return;
    }

    //based on some condition who is caller and who is reciever
    if (!offers) {
      await createOffer();
    } else {
      await createAnswerOffer();
    }
  };

  useEffect(() => {
    handleOffers();
    handleIceCandidate();
  }, [offers]);

  useEffect(() => {
    setLoading(true);
    axiosapi.success("Please wait while we connect!", "", 6);
    getMediaAndPeers();
  }, []);

  return (
    <div className="live-video-page">
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
      </div>
    </div>
  );
};

export default WebRTC;
