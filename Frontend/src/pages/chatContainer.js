import React, { useEffect, useState } from "react";
import Chatlist from "../components/chatlist";
import ChatWindow from "../components/chatwindow";
import { useContenctHook } from "../context/contextapi";
import WebRTC from "../components/rtc";

const ChatContainer = () => {
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

  return (
    <>
      <WebRTC data={data} />
      {switched ? (
        <Chatlist setSwitched={setSwitched} handleListData={handleListData} />
      ) : (
        <ChatWindow data={data} setSwitched={setSwitched} />
      )}
    </>
  );
};

export default ChatContainer;
