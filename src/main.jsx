import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { TransactionProvider } from "./context/TransactionContext.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <TransactionProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </TransactionProvider>
);
