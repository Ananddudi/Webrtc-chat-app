import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useContenctHook } from "../context/contextapi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosapi from "../services/api";

const Signup = ({ loginform, setLoginform }) => {
  const { formValidation } = useContenctHook();
  const [getParams, setParams] = useSearchParams({
    fullname: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    fullname: true,
    email: true,
    password: true,
  });

  const queryClient = useQueryClient();

  const onChangeHandling = (key, value) => {
    setParams((prev) => {
      prev.set(key, value);
      return prev;
    });
  };

  const close = () => {
    setLoginform("hide");
  };

  const { mutate } = useMutation({
    mutationFn: async (postdata) => {
      const result = await axiosapi.post({
        url: "/signup-user",
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
      if (mutationError.response.status == 409) {
        axiosapi.error("Already registered! Try different one", 5);
      } else {
        axiosapi.error(mutationError.response.data.message);
      }
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    const email = formValidation("email", getParams.get("email"));
    const password = formValidation("password", getParams.get("password"));
    const fullname = formValidation("fullname", getParams.get("fullname"));
    if (!email || !password || !fullname) {
      setError({
        fullname,
        email,
        password,
      });
      return;
    }

    mutate({
      fullname: getParams.get("fullname"),
      email: getParams.get("email"),
      password: getParams.get("password"),
    });
  };

  //It is used for handling error indication
  useEffect(() => {
    if (
      getParams.get("email") != "" &&
      getParams.get("password") != "" &&
      getParams.get("fullname") != ""
    ) {
      setError({
        fullname: true,
        email: true,
        password: true,
      });
    }

    if (getParams.get("fullname")) {
      // if (getParams.get("fullname").length < 5) return;
      setError((newpr) => ({
        ...newpr,
        fullname: formValidation("fullname", getParams.get("fullname")),
      }));
    }

    if (getParams.get("email")) {
      if (getParams.get("email").length < 5) return;
      setError((newpr) => ({
        ...newpr,
        email: formValidation("email", getParams.get("email")),
      }));
    }

    if (getParams.get("password")) {
      setError((newpr) => ({
        ...newpr,
        password: formValidation("password", getParams.get("password")),
      }));
    }
  }, [getParams]);

  return (
    <div className={`popupBackground ${loginform}`}>
      <div className={`popupMain ${loginform}`}>
        <form
          className={`
                  sign-up-form 
                  ${!error.fullname ? "fullname" : ""} 
                  ${error.email ? "" : "signEmail"} 
                  ${error.password ? "" : "signPassword"}
                  `}
          onSubmit={onSubmit}
        >
          <div>
            <h1>Sign Up</h1>
            <p>Sign up is not mandatory in order to chat, except name</p>
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              name="fullname"
              placeholder="Pleae enter full name with space"
              value={getParams.get("fullname")}
              onChange={(e) => onChangeHandling("fullname", e.target.value)}
            />
            <label htmlFor="signEmail">Email</label>
            <input
              type="email"
              name="signEmail"
              placeholder="Please enter email"
              value={getParams.get("email")}
              onChange={(e) => onChangeHandling("email", e.target.value)}
            />
            <label htmlFor="signPassword">Password</label>
            <input
              type="password"
              name="signPassword"
              placeholder="Please enter password"
              value={getParams.get("password")}
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

//we can use form onSubmit={handlesubmit} the const form = new Formdata to access form.name_of_input

export default Signup;
