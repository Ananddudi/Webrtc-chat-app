import React, { useEffect, useState } from "react";
import ChatWindowHeader from "./ChatWindowHeader";
import Message from "./message";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosapi from "../services/api";
import { useContenctHook } from "../context/contextapi";
import { socket } from "../services/socket";

const ChatWindow = ({ data, setSwitched }) => {
  const { setLoading, auth } = useContenctHook();
  const [convId, setConvId] = useState(null);
  const [messages, setMessages] = useState([]);

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

  return (
    <main className="chat-window-main">
      <ChatWindowHeader item={data} setSwitched={setSwitched} />
      <Message
        messages={messages}
        convId={convId}
        data={data}
        addMessage={addMessage}
      />
    </main>
  );
};

export default ChatWindow;
