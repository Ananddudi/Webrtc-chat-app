import React, { useEffect, useRef, useState } from "react";
import "./chatlist.css";
import { useContenctHook } from "../context/contextapi";
import { socket } from "../services/socket";
import { d_formate } from "../utils/dateFormate";

const ListItem = ({ item }) => {
  const [lstMessage, setLstmessage] = useState("No chat");
  const { auth } = useContenctHook();
  const [invoked, setInvoked] = useState(false);
  const imageurl = item.profilepic
    ? item.profilepic
    : require("../statics/profileImage.jpg");

  const showMessage = (msg) => {
    if (msg.includes("sharedFiles")) {
      msg = "*File Recieved*";
    } else {
      if (window.innerWidth < 768 && msg.length > 20) {
        msg = msg.substring(0, 20);
      } else if (msg.length > 50) {
        msg = msg.substring(0, 50);
      }
    }
    return msg;
  };

  useEffect(() => {
    const handleConv = (conversation) => {
      if (conversation && conversation.LastMessage) {
        setLstmessage(conversation.LastMessage.message);
      }
    };

    const hightlightHandle = () => {
      setInvoked(true);
    };

    if (auth) {
      socket.emit("get-last-message", item.email, item._id);
    }
    socket.on(`last-message-${item.email}`, handleConv);
    socket.on(`highlight ${item.email}`, hightlightHandle);
    return () => {
      socket.off(`last-message-${item.email}`, handleConv);
      socket.off(`highlight ${item.email}`, hightlightHandle);
    };
  }, [auth, item]);

  return (
    <section className="chat-info">
      <section className="chat-info-two">
        <div>
          <span
            id={
              item.available === "y"
                ? "image-online-icon-show"
                : "image-online-icon-show-not-show"
            }
          ></span>
          <img src={imageurl} alt={item._id} />
        </div>
        <div className="name-message">
          <div>{item.fullname}</div>
          <div className={invoked ? "highlight" : ""}>
            {showMessage(lstMessage)}
          </div>
        </div>
      </section>
      <div>{d_formate(item.createdAt)}</div>
    </section>
  );
};

const Chatlist = ({ handleListData }) => {
  const { filteredList, auth } = useContenctHook();
  const [userlist, setUserList] = useState([]);
  const [page, setPage] = useState(1);
  const chatListRef = useRef();

  const removeDuplicacy = (list) => {
    let set = new Set();
    return list
      .map((value) => {
        if (!set.has(value._id)) {
          set.add(value._id);
          return value;
        }
      })
      .filter((value) => value !== undefined);
  };

  useEffect(() => {
    const addUsersToList = (list) => {
      setUserList((prev) => {
        let val = removeDuplicacy([...prev, ...list]);
        return val;
      });
    };
    const handlePagination = () => {
      let chatlist = chatListRef.current;
      if (chatlist && auth) {
        if (
          chatlist.scrollHeight - chatlist.scrollTop ===
          chatlist.clientHeight
        ) {
          let newpage = page + 1;
          setPage(newpage);
        }
      }
    };
    chatListRef?.current?.addEventListener("scroll", handlePagination);
    socket.on("add-users", addUsersToList);
    return () => {
      socket.off("add-users", addUsersToList);
      chatListRef?.current?.removeEventListener("scroll", handlePagination);
    };
  }, [handleListData, auth]);

  useEffect(() => {
    setUserList(filteredList);
    setPage(1);
  }, [filteredList]);

  useEffect(() => {
    let limit = 10;
    socket.emit("get-users", page, limit);
  }, [page]);

  return (
    <div className="chat-list-container" ref={chatListRef}>
      {userlist.length == 0 && (
        <div className="user-not-found">
          <span>No User Found</span>
        </div>
      )}
      {userlist.map((item) => (
        <article
          key={item._id}
          className="chat-item"
          onClick={() => handleListData(item)}
        >
          <ListItem item={item} />
        </article>
      ))}
    </div>
  );
};

export default Chatlist;
