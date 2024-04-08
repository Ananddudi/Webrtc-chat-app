import React, { useEffect, useState } from "react";
import ChatWindowHeader from "./ChatWindowHeader";
import Message from "./message";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosapi from "../services/api";
import { useContenctHook } from "../context/contextapi";
import WebRTC from "../pages/webrtc";

const ChatWindow = ({ data, setSwitched }) => {
  const { setLoading, auth } = useContenctHook();
  const [convId, setConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [goLive, setGoLive] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async (postdata) => {
      const result = await axiosapi.post({
        url: "/create-conversation",
        data: postdata,
      });
      return result.data.conversation;
    },
    onSuccess: (result) => {
      setConvId(result._id);
    },
    onError: (error) => {
      axiosapi.error(error.response.data.message);
    },
  });

  const {
    status,
    data: newmessages,
    isFetching,
  } = useQuery({
    enabled: convId ? true : false,
    queryKey: ["conv", convId],
    queryFn: async () => {
      const result = await axiosapi.get({ url: `/get-all-messages/${convId}` });
      return result.data;
    },
  });

  const addMessage = (obj) => {
    setMessages((prev) => [...prev, obj]);
  };

  useEffect(() => {
    if (isPending || status === "pending") {
      auth && setLoading(true);
    }
    if (status === "success") {
      auth && setLoading(false);
      setMessages(newmessages.messages);
    }
  }, [isFetching, status, isPending]);

  useEffect(() => {
    mutate({ userTwo: data._id });
  }, []);

  const renderChatOrRtc = () => {
    if (goLive) {
      return <WebRTC data={data} />;
    }
    return (
      <>
        <ChatWindowHeader
          item={data}
          setSwitched={setSwitched}
          setGoLive={setGoLive}
        />
        <Message
          messages={messages}
          convId={convId}
          data={data}
          addMessage={addMessage}
        />
      </>
    );
  };

  return <main className="chat-window-main">{renderChatOrRtc()}</main>;
};

export default ChatWindow;
