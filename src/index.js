import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { GameContextProvider } from "./context/gameContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <GameContextProvider>
      <App />
    </GameContextProvider>
  </BrowserRouter>
);