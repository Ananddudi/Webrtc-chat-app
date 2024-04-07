import React, { useEffect, useRef, useState } from "react";
import "./webrtc.css";
import { useContenctHook } from "../context/contextapi";
import axiosapi from "../services/api";

const WebRTC = () => {
  const { setLoading, liveChatOffer } = useContenctHook();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const remoteVidRef = useRef();
  const localVidRef = useRef();

  const getMediaAndPeers = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      // audio:true
    });
    setLocalStream(stream);
    setRemoteStream(new MediaStream());
    const peerConnect = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
          ],
        },
      ],
    });
    setPeerConnection(peerConnect);
  };

  useEffect(() => {
    if (remoteStream) {
      remoteVidRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    if (localStream) {
      if (peerConnection) {
        localStream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStream);
        });
      }
      localVidRef.current.srcObject = localStream;
    }
  }, [localStream, peerConnection]);

  useEffect(() => {
    if (peerConnection) {
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          //fire socket to store id candidate with this username
        } else {
          console.log("Oops: No ice candidate found!");
        }
      };

      peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track, remoteStream);
        });
      };
    }
  }, [peerConnection]);

  useEffect(() => {
    setLoading(true);
    axiosapi.success("Please wait while we connect!", "", 6);
    getMediaAndPeers();
  }, []);

  const createOfferOrGetOffer = async () => {
    if (peerConnection) {
      if (!liveChatOffer) {
        // if liveChatAnswerer is false then it is calling
        //create offer and send to reciever
        const offer = await peerConnection.createOffer();
        peerConnection.setLocalDescription(offer);
        //make socket call to backend for registering offer
      } else {
        await peerConnection.setRemoteDescription(liveChatOffer);
        const answerOffer = await peerConnection.createAnswer({});
        peerConnection.setLocalDescription(answerOffer);

        // if liveChatAnswerer is true means it get call from remote
      }
    }
  };

  useEffect(() => {
    createOfferOrGetOffer();
  }, [liveChatOffer, peerConnection]);

  return (
    <div className="live-video-page">
      <div className="videoWrappers">
        <video
          className="remote-video-player"
          id="remote-video"
          ref={remoteVidRef}
          autoPlay
        >
          {/* <source src={videofile} type="video/mp4" /> */}
        </video>
        <video
          className="local-video-player"
          id="local-video"
          autoPlay
          ref={localVidRef}
        >
          {/* <source src={videofile} type="video/mp4" /> */}
        </video>
      </div>
    </div>
  );
};

export default WebRTC;
