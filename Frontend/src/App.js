import ChatHeader from "./components/chatheaders";
import Header from "./components/header";
import ChatContainer from "./pages/chatContainer";
import React, { Suspense, useEffect, useState } from "react";
import { ReactComponent as Svgfile } from "./statics/loading.svg";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MyProfile from "./pages/profile";
import Errors from "./pages/error";
import "./App.css";
import "./devices style/style.css";
import Loader from "./components/loader";
import Feedback from "./pages/feedback";
import { useContenctHook } from "./context/contextapi";
import useScreenSize from "./hooks/useScreenSize";
import AddingUser from "./components/addingUser";
import { RiCloseCircleFill } from "react-icons/ri";

const PrivateRoute = ({ children }) => {
  const { auth } = useContenctHook();
  if (!auth) {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  const [showMail, setShowMail] = useState(false);
  const [versionCheck, setVersionCheck] = useState(false);
  const { load } = useScreenSize();

  useEffect(() => {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf("Edg") !== -1) {
      // For Microsoft Edge (Chromium)
      let browserVersion = userAgent.match(/Edg\/([\d.]+)/);
      if (browserVersion[1].split(".")[0] < 123) {
        setVersionCheck(true);
      }
    } else {
      // For other browsers
      let browserVersion = userAgent.match(
        /(Chrome|Safari|Firefox|Opera)\/([\d.]+)/
      );
      // For other chrome
      if (
        browserVersion[2].split(".")[0] < 123 &&
        browserVersion[1] == "Chrome"
      ) {
        setVersionCheck(true);
      }
      // For other Firefox
      if (
        browserVersion[2].split(".")[0] < 124 &&
        browserVersion[1] == "Firefox"
      ) {
        setVersionCheck(true);
      }
    }
  }, []);

  const mainpage = () => {
    if (load) {
      return (
        <main className="first-intro">
          <div className="man1">
            <Svgfile />
          </div>
          <div className="welcome">Your Welcome</div>
        </main>
      );
    }
    return (
      <div className="home">
        {versionCheck && window.innerWidth < 768 && (
          <div className="version-warning">
            <div>
              Your browser is not up to date. This may cause messages may not
              appear in chatbox.Please update your browser.
            </div>
            <RiCloseCircleFill
              className="close-warning"
              onClick={() => setVersionCheck(false)}
            />
          </div>
        )}
        <Header />
        <div className="Mainclass">
          <main className="containerForChat">
            <ChatHeader />
            <ChatContainer setShowMail={setShowMail} />
            {showMail && <AddingUser />}
          </main>
        </div>
      </div>
    );
  };

  return (
    <>
      <BrowserRouter>
        <Loader />
        <Routes>
          <Route path="/" element={mainpage()} />
          <Route
            path="/profile"
            element={
              <Suspense fallback="please wait">
                <MyProfile />
              </Suspense>
            }
          />
          <Route
            path="/feedback"
            element={
              <PrivateRoute>
                <Feedback />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Errors />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
