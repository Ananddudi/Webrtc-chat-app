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
import { RiMenu3Fill } from "react-icons/ri";
import { MdOutlineRestaurantMenu } from "react-icons/md";

const Header = () => {
  const { auth } = useContenctHook();
  const [showpopup, setShowpopup] = useState("");
  const [loginform, setLoginform] = useState("");
  const [login, setLogin] = useState("");
  const [showMenu, setShowMenu] = useState("");

  const queryClient = useQueryClient();

  const showPhoneMenu = () => {
    let newclass = "";
    if (auth && (showMenu === "hide" || showMenu === "")) {
      newclass = "showWithAuth";
    } else if (!auth && (showMenu === "hide" || showMenu === "")) {
      newclass = "show";
    } else if (!auth && showMenu === "show") {
      newclass = "hide";
    } else if (auth && showMenu === "show") {
      newclass = "hideWithAuth";
    }
    console.log("check", newclass);
    setShowMenu(newclass);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        !event.target.closest(".popupMain") &&
        !event.target.closest(".profile") &&
        !event.target.closest(".side-menu") &&
        !event.target.closest(".menu-icon")
      ) {
        if (showMenu) setShowMenu("hide");
        if (login) setLogin("hide");
        if (loginform) setLoginform("hide");
        if (showpopup) setShowpopup("hide");
      }
    };

    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [login, loginform, showpopup, showMenu]);

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

  useEffect(() => {
    if (showpopup || login || loginform || !auth) {
      setShowMenu("hide");
    }
  }, [showpopup, login, loginform, auth]);

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
          onClick={() => setLoginform("show")}
          title="SignUp"
          className="profile"
        >
          Sign up
        </button>
        <button
          title="LogIn"
          onClick={() => setLogin("show")}
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
          <div className={`links ${showMenu}`}>
            <Link
              to="/"
              onClick={() => setShowpopup("show")}
              title="Profile"
              className="profile"
            >
              Profile
            </Link>
            <Links />
          </div>
        </div>
        <Search />
        <div className="side-menu">
          {showMenu === "show" ? (
            <MdOutlineRestaurantMenu
              className="menu-icon"
              onClick={showPhoneMenu}
            />
          ) : (
            <RiMenu3Fill className="menu-icon" onClick={showPhoneMenu} />
          )}
        </div>
      </nav>
      <Popup showpopup={showpopup} />
      <Signup loginform={loginform} setLoginform={setLoginform} />
      <Login login={login} setLogin={setLogin} />
    </main>
  );
};

export default Header;
