import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ContextApiProvider } from "./context/contextapi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import "./toast.css";

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById("root"));

function Index() {
  return (
    <QueryClientProvider client={queryClient}>
      <ContextApiProvider>
        <App />
      </ContextApiProvider>
      <Toaster
        position="right-bottom"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          bottom: 100,
        }}
      />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}

root.render(
  // <React.StrictMode>
  <Index />
  // </React.StrictMode>
);
