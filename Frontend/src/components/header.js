import React, { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Popup from "./popup";
import Signup from "../pages/signup";
import Login from "../pages/login";
import Logo from "../statics/logo.png";
import { useContenctHook } from "../context/contextapi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosapi from "../services/api";
import Search from "./search";

const Header = () => {
  const { auth } = useContenctHook();
  let [showpopup, setShowpopup] = useState(false);
  let [loginform, setLoginform] = useState(false);
  let [login, setLogin] = useState(false);

  const popups = () => {
    if (showpopup) return <Popup setShowpopup={setShowpopup} />;
    if (loginform) return <Signup setLoginform={setLoginform} />;
    if (login) return <Login setLogin={setLogin} />;
  };

  const queryClient = useQueryClient();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        !event.target.closest(".popupMain") &&
        !event.target.closest(".profile")
      ) {
        if (login) setLogin(false);
        if (loginform) setLoginform(false);
        if (showpopup) setShowpopup(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [login, loginform, showpopup]);

  const { mutate } = useMutation({
    mutationFn: async () => {
      const result = await axiosapi.delete({
        url: "/logout-user",
      });
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      axiosapi.success("Successfully logout");
    },
    onError: (mutationError) => {
      if (mutationError && mutationError.response.status == 500) {
        axiosapi.error(mutationError.response.data.message);
      }
    },
  });

  const Links = memo(() => {
    if (auth) {
      return (
        <button title="Logout" className="profile" onClick={() => mutate()}>
          Sign Out
        </button>
      );
    }
    return (
      <>
        <button
          onClick={() => setLoginform(true)}
          title="SignUp"
          className="profile"
        >
          Sign up
        </button>
        <button
          title="LogIn"
          onClick={() => setLogin(true)}
          className="profile"
        >
          Log in
        </button>
      </>
    );
  });

  return (
    <main>
      <nav className="navbar">
        <div className="portion">
          <img className="logo" src={Logo} alt="logo" />
          <div className="links">
            <Link
              to="/"
              onClick={() => setShowpopup(true)}
              title="Profile"
              className="profile"
            >
              Profile
            </Link>
            <Links />
          </div>
        </div>
        <Search />
      </nav>
      {popups()}
    </main>
  );
};

export default Header;
