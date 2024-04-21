import React, { useEffect, useState } from "react";
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
import Signout from "./signout";

const Links = ({ auth, setLoginform, setLogin, mutate }) => {
  if (auth) {
    return <Signout mutate={mutate} />;
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
};

const Header = () => {
  const { auth, warning, setWarning } = useContenctHook();
  const [showpopup, setShowpopup] = useState("");
  const [loginform, setLoginform] = useState("");
  const [login, setLogin] = useState("");
  const [showMenu, setShowMenu] = useState("");

  const queryClient = useQueryClient();

  const showPhoneMenu = () => {
    let newclass = "";
    if (auth && (showMenu === "hideWithAuth" || showMenu === "")) {
      newclass = "showWithAuth";
    } else if (!auth && (showMenu === "hide" || showMenu === "")) {
      newclass = "show";
    } else if (!auth && showMenu === "show") {
      newclass = "hide";
    } else if (auth && showMenu === "showWithAuth") {
      newclass = "hideWithAuth";
    }
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
        if (showMenu) {
          if (!auth) {
            setShowMenu("hide");
          } else {
            setShowMenu("hideWithAuth");
          }
        }
        if (login) setLogin("hide");
        if (loginform) setLoginform("hide");
        if (showpopup) setShowpopup("hide");
      }
    };

    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [login, loginform, showpopup, showMenu]);

  const { mutate } = useMutation({
    mutationFn: async (value = false) => {
      if (value) {
        setWarning({ login: false, logout: true });
      }
      const result = await axiosapi.delete({
        url: "/logout-user",
      });
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      warning.logout && axiosapi.success("Successfully logout");
    },
    onError: (mutationError) => {
      if (mutationError && mutationError.response.status == 500) {
        axiosapi.error(mutationError.response.data.message);
      }
    },
  });

  useEffect(() => {
    if (showpopup || login || loginform || auth || !auth) {
      setShowMenu("");
    }
  }, [showpopup, login, loginform, auth]);

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
            <Links
              mutate={mutate}
              auth={auth}
              setLoginform={setLoginform}
              setLogin={setLogin}
            />
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
      <Login login={login} setLogin={setLogin} mutate={mutate} />
    </main>
  );
};

export default Header;
