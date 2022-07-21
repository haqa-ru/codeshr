import React from "react";
import ReactDOM from "react-dom/client";
import "./index.module.scss";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LocalProvider } from "./contexts/LocalContext";
import Settings from "./components/Settings";
import Error from "./components/Error";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <LocalProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path=":id" element={<App />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  </LocalProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
