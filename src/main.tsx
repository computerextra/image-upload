import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/index.css";
import App from "@/App.tsx";
import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./Layout";
import Success from "./Success";
import Fail from "./Fail";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<App />} />
          <Route path="Fehler" element={<Fail />} />
          <Route path=":hash" element={<Success />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
