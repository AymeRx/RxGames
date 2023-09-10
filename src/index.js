import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { GameContextProvider } from "./context/gameContext";
import { RoleContextProvider } from "./context/roleContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <RoleContextProvider>
            <GameContextProvider>
                <App />
            </GameContextProvider>
        </RoleContextProvider>
    </BrowserRouter>
);