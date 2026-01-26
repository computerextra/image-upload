import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.tsx";
import Header from "./components/Header.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto my-5">
        <App />
      </div>
    </div>
  </StrictMode>,
);
