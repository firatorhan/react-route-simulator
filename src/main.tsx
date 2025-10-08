import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { RouteProvider } from "./context/RouteContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <RouteProvider>
        <App />
      </RouteProvider>
    </BrowserRouter>
  </StrictMode>
);
