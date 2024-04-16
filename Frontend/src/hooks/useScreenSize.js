import { useEffect, useState } from "react";

const useScreenSize = () => {
  const [load, setLoad] = useState(true);
  useEffect(() => {
    let id;
    const handleResize = () => {
      let time = 0; //seconds
      let value = window.innerWidth;
      switch (true) {
        case value < 768:
          time = 4;
          break;
        case 768 < value < 1024:
          time = 4.5;
          break;
        case 1024 < value < 1440:
          time = 5;
          break;
        case value > 1440:
          time = 6;
          break;
      }
      id = setTimeout(() => {
        setLoad(false);
      }, time * 1000);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(id);
    };
  }, []);

  return { load };
};

export default useScreenSize;
