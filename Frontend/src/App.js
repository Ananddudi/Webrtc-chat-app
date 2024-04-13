import ChatHeader from "./components/chatheaders";
import Header from "./components/header";
import ChatContainer from "./pages/chatContainer";
import React, { Suspense, useEffect, useState } from "react";
import { ReactComponent as Svgfile } from "./statics/loading.svg";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MyProfile from "./pages/profile";
import Errors from "./pages/error";
import "./App.css";
import Loader from "./components/loader";
import Feedback from "./pages/feedback";
import { useContenctHook } from "./context/contextapi";

const PrivateRoute = ({ children }) => {
  const { auth } = useContenctHook();

  if (!auth) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const [load, setLoad] = useState(true);
  const mainpage = () => {
    if (true) {
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
      // <ProtectedRoute>
      <div className="home">
        <Header />
        <div className="Mainclass">
          <main className="containerForChat">
            <ChatHeader />
            <ChatContainer />
          </main>
        </div>
      </div>
      // </ProtectedRoute>
    );
  };

  useEffect(() => {
    let id;
    id = setTimeout(() => {
      setLoad(false);
    }, 9000);
    return () => clearTimeout(id);
  }, [load]);

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
