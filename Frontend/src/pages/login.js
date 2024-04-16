import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useContenctHook } from "../context/contextapi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosapi from "../services/api";
import { wait } from "../services/utils";

const Login = ({ login, setLogin }) => {
  const { formValidation } = useContenctHook();

  const [searchParams, setSearchParams] = useSearchParams({
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    email: true,
    password: true,
  });

  const onChangeHandling = (key, value) => {
    setSearchParams((prev) => {
      prev.set(key, value);
      return prev;
    });
  };

  const close = () => {
    setLogin("hide");
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
      axiosapi.success("Successfully logged in");
      close();
    },
    onError: (mutationError) => {
      if (mutationError.response.status == 500) {
        wait(() => axiosapi.error(mutationError.response.data.message), 3);
        axiosapi.success("Please sign up first!");
      }
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    let email = formValidation("email", searchParams.get("email"));
    let password = formValidation("password", searchParams.get("password"));

    if (!email || !password) {
      setError({
        email,
        password,
      });
      return;
    }

    mutate({
      email: searchParams.get("email"),
      password: searchParams.get("password"),
    });
  };

  //It is used for handling error indication
  useEffect(() => {
    if (searchParams.get("email") != "" && searchParams.get("password") != "") {
      setError({
        email: true,
        password: true,
      });
    }

    if (searchParams.get("email")) {
      if (searchParams.get("email").length < 5) return;
      setError((newpr) => ({
        ...newpr,
        email: formValidation("email", searchParams.get("email")),
      }));
    }

    if (searchParams.get("password")) {
      setError((newpr) => ({
        ...newpr,
        password: formValidation("password", searchParams.get("password")),
      }));
    }
  }, [searchParams]);

  return (
    <div className={`${login == "show" ? "popupBackground" : ""}`}>
      <div className={`popupMain ${login}`}>
        <form
          className={`
          sign-up-form 
          ${error.email ? "" : "loginEmail"} 
          ${error.password ? "" : "loginPassword"}
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
            {error.password || (
              <span className="error">
                Password must have one lowercase, one uppercase and one a digit
                character!
              </span>
            )}
            <div className="btn-center">
              <input
                type="submit"
                value="Submit"
                className="commonBtn profilebtn mg"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
