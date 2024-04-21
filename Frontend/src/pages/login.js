import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useContenctHook } from "../context/contextapi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosapi from "../services/api";
import { Cliploader } from "../components/loader";
import { useFormValidation } from "../hooks/useFormvalidation";
import { socket } from "../services/socket";

const Login = ({ login, setLogin, mutate: logoutMutate }) => {
  const { users, auth, setWarning } = useContenctHook();
  const { error, onChange, setErrors } = useFormValidation();
  const [showLoader, setShowLoader] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams({
    email: "",
    password: "",
  });

  const onChangeHandling = (key, value) => {
    onChange(key, value);
    setSearchParams((prev) => {
      prev.set(key, value);
      return prev;
    });
  };

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (postdata) => {
      const result = await axiosapi.post({
        url: "/login-user",
        data: postdata,
      });
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (mutationError) => {
      setShowLoader(false);
      axiosapi.error(mutationError.response.data.message);
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!searchParams.get("email")) {
      setErrors("email");
      return;
    }
    if (!searchParams.get("password")) {
      setErrors("password");
      return;
    }
    if (error.email || error.password) return;
    setShowLoader(true);
    mutate({
      email: searchParams.get("email"),
      password: searchParams.get("password"),
    });
  };

  useEffect(() => {
    if (users[0].email !== "NotInUse" && auth) {
      setShowLoader(false);
      setLogin("hide");
    }
  }, [users, auth]);

  useEffect(() => {
    const handleExistUser = (value) => {
      if (value) {
        setWarning({ login: false, logout: false }); //hiding both login and logout warnings
        logoutMutate();
        setShowLoader(false);
        axiosapi.error("User is Already Online!", "toastError", 6);
      } else {
        axiosapi.success("Successfully logged in");
      }
    };
    socket.on("exist", handleExistUser);
    return () => {
      socket.off("exist", handleExistUser);
    };
  }, []);

  return (
    <div className={`popupBackground ${login}`}>
      <div className={`popupMain ${login}`}>
        <form
          className={`
          sign-up-form 
          ${error.email ? "loginEmail" : ""} 
          ${error.password ? "loginPassword" : ""}
          `}
          onSubmit={onSubmit}
        >
          <div>
            <h1>Login</h1>
            <p>If you are not sign up then please sign up first</p>
            <label htmlFor="loginEmail">Email</label>
            <input
              type="email"
              name="loginEmail"
              placeholder="Please enter email"
              onChange={(e) => onChangeHandling("email", e.target.value)}
              value={searchParams.get("email")}
            />
            <label htmlFor="loginPassword">Password</label>
            <input
              value={searchParams.get("password")}
              type="password"
              name="loginPassword"
              placeholder="Please enter password"
              onChange={(e) => onChangeHandling("password", e.target.value)}
            />
            {error.password && (
              <div className="error">
                {window.innerWidth < 768
                  ? "Provide one lowercase, one uppercase, one a digit"
                  : " Password must have one lowercase, one uppercase and one a digit character!"}
              </div>
            )}
            <div className="btn-center">
              <button type="submit" className="profilebtn mg loginbtn">
                {showLoader ? (
                  <div className="wait-loader">
                    <Cliploader />
                  </div>
                ) : (
                  <span>Submit</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
