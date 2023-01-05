import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from "./pages/App";
import Credits from "./pages/Credits";
import Error from "./pages/Error";
import Qr from "./pages/Qr";
import Markdown from "./pages/Markdown";

import "./index.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="qr" element={<Qr />} />
      <Route path="credits" element={<Credits />} />
      <Route path="markdown" element={<Markdown />} />
      <Route path=":id" element={<App />} />
      <Route path="*" element={<Error />} />
    </Routes>
  </BrowserRouter>
);
