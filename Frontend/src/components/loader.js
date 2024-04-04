import React from "react";
import HashLoader from "react-spinners/HashLoader";

const Loader = ({ loading = false }) => {
  const override = {
    display: "block",
    borderColor: "white",
    zIndex: 555,
  };

  if (!loading) return null;
  return (
    <div className="popupBackground">
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

export default Loader;
