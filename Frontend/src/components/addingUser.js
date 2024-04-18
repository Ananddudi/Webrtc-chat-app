import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FcInvite } from "react-icons/fc";
import axiosapi from "../services/api";
import { useContenctHook } from "../context/contextapi";

const AddingUser = () => {
  let [adduser, setAdduser] = useState("");
  const [disable, setDisable] = useState(false);

  const { formValidation } = useContenctHook();

  const close = () => {
    setAdduser("hide");
  };

  const { mutate } = useMutation({
    mutationFn: async (postdata) => {
      const result = await axiosapi.post({
        url: "/invite-user",
        data: postdata,
      });
      return result.data;
    },
    onSuccess: () => {
      close();
      axiosapi.success(
        "We have sent mail to the user of your invitation successfully",
        "toastSuccess",
        4
      );
      setDisable(false);
    },
    onError: (error) => {
      axiosapi.error(error.response.data.message, "toastSuccess", 4);
      setDisable(false);
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    setDisable(true);
    let form = new FormData(e.target);
    const email = form.get("email");
    if (!formValidation("email", email)) {
      axiosapi.error("Please formate email properly");
      return;
    }
    mutate({ email });
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        !event.target.closest(".popupMain") &&
        !event.target.closest(".addUserIcon")
      ) {
        if (adduser === "show") setAdduser("hide");
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [adduser]);

  const handleAnimation = (e) => {
    setAdduser("show");
  };

  return (
    <>
      {(adduser == "hide" || adduser == "") && (
        <FcInvite onClick={handleAnimation} className="addUserIcon" />
      )}
      <div className={`popupBackground ${adduser}`}>
        <div className={`popupMain ${adduser}`}>
          <form className="sign-up-form" onSubmit={onSubmit}>
            <div>
              <h1>Invite</h1>
              <p>You can invite you friends and family</p>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Pleae enter your friend email"
              />

              <div className="btn-center">
                <input
                  type="submit"
                  value={disable ? "wait" : "Invite"}
                  disabled={disable}
                  className={`commonBtn profilebtn mg ${
                    disable ? "grayout" : ""
                  }`}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddingUser;
