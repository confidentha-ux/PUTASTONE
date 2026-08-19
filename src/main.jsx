import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserStateProvider } from "./state/UserStateContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserStateProvider>
      <App />
    </UserStateProvider>
  </StrictMode>
);
