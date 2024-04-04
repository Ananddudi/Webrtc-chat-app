import React, { useRef } from "react";
import "./feedback.css";
import { Link, Navigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axiosapi from "../services/api";

const Feedback = () => {
  const textarearef = useRef();
  const { mutate } = useMutation({
    mutationFn: async (postdata) => {
      const result = await axiosapi.put({
        url: "/feedback-user",
        data: postdata,
      });
      return result.data;
    },
    onSuccess: () => {
      axiosapi.success("Feedback successfully sent.");
      textarearef.current.value = "";
    },
    onError: (mutationError) => {
      axiosapi.error(mutationError.response.data.message);
    },
  });

  const submitfeedback = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const feedback = form.get("feedback");
    mutate({ feedback });
  };

  return (
    <main className="feedbackPage">
      <Link to="/" className="profileBackButton">
        <span>Back</span>
      </Link>
      <form onSubmit={submitfeedback}>
        <label htmlFor="feedback">Feedback</label>
        <textarea
          name="feedback"
          id="feedback"
          cols="100"
          rows="10"
          ref={textarearef}
        ></textarea>
        <input type="submit" value="Submit" className="commonBtn" />
      </form>
    </main>
  );
};

export default Feedback;
