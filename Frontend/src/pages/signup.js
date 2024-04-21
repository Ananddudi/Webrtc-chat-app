import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useContenctHook } from "../context/contextapi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosapi from "../services/api";
import { Cliploader } from "../components/loader";
import { useFormValidation } from "../hooks/useFormvalidation";

const Signup = ({ loginform, setLoginform }) => {
  const { users, auth } = useContenctHook();
  const { error, onChange, setErrors } = useFormValidation();
  const [showLoader, setShowLoader] = useState(false);
  const [getParams, setParams] = useSearchParams({
    fullname: "",
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const onChangeHandling = (key, value) => {
    onChange(key, value);
    setParams((prev) => {
      prev.set(key, value);
      return prev;
    });
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
    },
    onError: (mutationError) => {
      setShowLoader(false);
      if (mutationError.response.status == 409) {
        axiosapi.error("This email is not available!", 5);
      } else {
        axiosapi.error(mutationError.response.data.message);
      }
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!getParams.get("fullname")) {
      setErrors("fullname");
      return;
    }
    if (!getParams.get("email")) {
      setErrors("email");
      return;
    }
    if (!getParams.get("password")) {
      setErrors("password");
      return;
    }
    if (error.email || error.password) return;
    setShowLoader(true);
    mutate({
      fullname: getParams.get("fullname"),
      email: getParams.get("email"),
      password: getParams.get("password"),
    });
  };

  useEffect(() => {
    if (users[0].email !== "NotInUse" && auth) {
      setShowLoader(false);
      setLoginform("hide");
    }
  }, [users, auth]);

  return (
    <div className={`popupBackground ${loginform}`}>
      <div className={`popupMain ${loginform}`}>
        <form
          className={`
                  sign-up-form 
                  ${error.fullname ? "fullname" : ""} 
                  ${error.email ? "signEmail" : ""} 
                  ${error.password ? "signPassword" : ""}
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

//we can use form onSubmit={handlesubmit} the const form = new Formdata to access form.name_of_input

export default Signup;
