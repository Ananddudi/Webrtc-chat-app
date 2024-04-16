import ChatHeader from "./components/chatheaders";
import Header from "./components/header";
import ChatContainer from "./pages/chatContainer";
import React, { Suspense } from "react";
import { ReactComponent as Svgfile } from "./statics/loading.svg";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MyProfile from "./pages/profile";
import Errors from "./pages/error";
import "./App.css";
import "./devices style/app.css";
import Loader from "./components/loader";
import Feedback from "./pages/feedback";
import { useContenctHook } from "./context/contextapi";
import useScreenSize from "./hooks/useScreenSize";
import AddingUser from "./components/addingUser";

const PrivateRoute = ({ children }) => {
  const { auth } = useContenctHook();
  if (!auth) {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  const { load } = useScreenSize();
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
      // <ProtectedRoute>
      <div className="home">
        <Header />
        <div className="Mainclass">
          <main className="containerForChat">
            <ChatHeader />
            <ChatContainer />
            <AddingUser />
          </main>
        </div>
      </div>
      // </ProtectedRoute>
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
