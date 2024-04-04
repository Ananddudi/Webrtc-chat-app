import ChatHeader from "./components/chatheaders";
import Header from "./components/header";
import ChatContainer from "./pages/chatContainer";
import React, { Suspense } from "react";
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
  const { load } = useContenctHook();
  const mainpage = () => {
    if (load) {
      return (
        <>
          <div className="man1">
            <Svgfile />
          </div>
          <div className="welcome">Welcome To Anand Dudi App</div>
        </>
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
