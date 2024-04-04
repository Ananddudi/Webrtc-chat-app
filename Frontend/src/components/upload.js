import React from "react";
import "./upload.css";
import { ImUpload } from "react-icons/im";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosapi from "../services/api";

const UploadImage = () => {
  const queryClient = useQueryClient();
  //If you want to use preview
  // const [preview,setPreview] = useState(null)
  // const uploadPreview = (newfile) => {
  //   const file = new FileReader();
  //   file.onload = function () {
  //     setPreview(file.result)
  //   };
  //   file.readAsDataURL(newfile);
  // };
  // <img src={preview} alt="img" />

  const { mutate } = useMutation({
    mutationFn: async (postdata) => {
      const formdata = new FormData();
      formdata.append("profilepic", postdata);
      const result = await axiosapi.post({
        url: "/fileupload-user",
        data: formdata,
      });
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      axiosapi.success("file Uploaded successfully");
    },
    onError: (error) => {
      axiosapi.error(error.response.data.message);
    },
  });

  const handlefilechange = (e) => {
    e.preventDefault();
    if (!e.target.files[0]) {
      axiosapi.success("file should not empty");
    }
    mutate(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!e.dataTransfer.files[0]) {
      axiosapi.success("file should not empty");
    }
    mutate(e.dataTransfer.files[0]);
  };

  const handleDragover = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="uploadImage"
      onDragOver={handleDragover}
      onDrop={handleDrop}
    >
      <label htmlFor="image-upload-file" className="upload-image-lable">
        <ImUpload className="upload-icons" />
        Drag here or select
        <input
          type="file"
          name="imageUpload"
          id="image-upload-file"
          accept="image/png,image/jpg"
          className="uploadImageInput"
          onChange={handlefilechange}
        />
      </label>
    </div>
  );
};

export default UploadImage;
