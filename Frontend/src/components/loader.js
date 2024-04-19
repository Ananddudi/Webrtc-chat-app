import React from "react";
import HashLoader from "react-spinners/HashLoader";
import ClipLoader from "react-spinners/ClipLoader";

export const Hashloader = ({ loading = false }) => {
  const override = {
    display: "block",
    borderColor: "white",
    zIndex: 555,
  };

  if (!loading) return null;
  return (
    <div className={`loaderBackground`}>
      <div className="main-loader">
        <HashLoader
          color={"wheat"}
          size={100}
          loading={loading}
          cssOverride={override}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <div>Loading Please Wait...</div>
      </div>
    </div>
  );
};

export const Cliploader = () => {
  const override = {
    display: "block",
    borderColor: "white",
  };

  return (
    <ClipLoader
      color={"wheat"}
      size={12}
      cssOverride={override}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};
