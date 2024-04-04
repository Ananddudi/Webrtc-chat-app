import React, { useEffect, useState } from "react";
import Chatlist from "../components/chatlist";
import ChatWindow from "../components/chatwindow";
import { useContenctHook } from "../context/contextapi";

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

  if (switched) {
    return (
      <Chatlist setSwitched={setSwitched} handleListData={handleListData} />
    );
  }
  return <ChatWindow data={data} setSwitched={setSwitched} />;
};

export default ChatContainer;
