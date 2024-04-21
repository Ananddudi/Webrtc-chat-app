import { createContext, useState, useEffect, useContext } from "react";
import { socket } from "../services/socket";
import validator from "validator";
import axiosapi from "../services/api";
import { useQuery } from "@tanstack/react-query";
import { Hashloader } from "../components/loader";
import mockdata from "../mockdata/data.json";
import useScreenSize from "../hooks/useScreenSize";

export let ContextApi = createContext();

let ContextApiProvider = ({ children }) => {
  const { load } = useScreenSize();
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState(mockdata);
  const [search, setSearch] = useState("");
  const [warning, setWarning] = useState({
    login: true,
    logout: true,
  });

  const [rtcAnswereData, setRtcAnswereData] = useState(null);

  const authorization = async () => {
    const result = await axiosapi.get({ url: "/authentication-user" });
    return result.data;
  };

  const { data, error, isLoading, isFetching } = useQuery({
    enabled: load === false ? true : false,
    queryKey: ["auth"],
    queryFn: authorization,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    }
    if (error) {
      setAuth(null);
      setUsers(mockdata);
      setLoading(false);
      warning.login && axiosapi.error("Please login!", "toastError", 2);
    } else if (data) {
      socket.connect();
      setAuth(data);
    }
  }, [error, isLoading, isFetching]);

  useEffect(() => {
    if (socket.connected && !auth) {
      socket.disconnect();
    }

    function updateList(list) {
      let index = list.findIndex((v) => v.email === auth?.email);
      if (index !== -1) {
        list.splice(index, 1);
      }
      setUsers(list);
      setLoading(false);
    }

    function errorMessage(message) {
      axiosapi.error(message);
    }

    socket.on("onlineUsers", updateList);
    socket.on("error", errorMessage);
    return () => {
      socket.off("onlineUsers", updateList);
      socket.off("error", errorMessage);
    };
  }, [auth]);

  const filteredList = users.filter((val) => {
    if (val.fullname.toLowerCase().startsWith(search.toLowerCase()))
      return true;
    if (!search) return true;
    return false;
  });

  let globalObject = {
    setLoading,
    auth,
    users,
    filteredList,
    setSearch,
    rtcAnswereData,
    setRtcAnswereData,
    warning,
    setWarning,
  };

  return (
    <ContextApi.Provider value={globalObject}>
      {children}
      <Hashloader loading={loading} />
    </ContextApi.Provider>
  );
};

const useContenctHook = () => {
  return useContext(ContextApi);
};

export { useContenctHook, ContextApiProvider };
