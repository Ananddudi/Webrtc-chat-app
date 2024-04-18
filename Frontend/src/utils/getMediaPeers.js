import { rtchandshake } from "../services/socket";

export const getMediaAndPeers = async ({
  peerConnection,
  localVidRef,
  remoteVidRef,
  reciever,
}) => {
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
        console.log("ice candidate for reciever", {
          reciever,
          iceCandidate: event.candidate,
        });
        rtchandshake("addIce", reciever, event.candidate);
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
