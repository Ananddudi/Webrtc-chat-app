import React, { useEffect, useState } from "react";
import { Hashloader } from "./loader";
import { useContenctHook } from "../context/contextapi";

const Signout = ({ mutate }) => {
  const { users } = useContenctHook();
  const [loader, setLoader] = useState(false);

  const handleSignOut = async () => {
    setLoader(true);
    try {
      mutate(true);
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  useEffect(() => {
    if (users[0].email === "NotInUse") {
      setLoader(false);
    }
  }, [users]);

  return (
    <div>
      <Hashloader loading={loader} />
      <button title="Logout" className="profile" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
};

export default Signout;
