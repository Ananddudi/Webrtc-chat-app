import React, { useEffect, useState } from "react";
import Chatlist from "../components/chatlist";
import ChatWindow from "../components/chatwindow";
import { useContenctHook } from "../context/contextapi";
import WebRtcHandshake from "../components/rtcHandshake";

const ChatContainer = ({ setShowMail }) => {
  const { auth } = useContenctHook();
  const [switched, setSwitched] = useState(true);
  const [data, setData] = useState({});

  const handleListData = (newdata) => {
    setData(newdata);
    setSwitched(false);
  };

  useEffect(() => {
    setSwitched(true);
  }, [auth]);

  //This effect is for closing mail box on window opening
  useEffect(() => {
    setShowMail(switched);
  }, [switched]);

  return (
    <>
      <WebRtcHandshake />
      {switched ? (
        <Chatlist setSwitched={setSwitched} handleListData={handleListData} />
      ) : (
        <ChatWindow data={data} setSwitched={setSwitched} />
      )}
    </>
  );
};

export default ChatContainer;
