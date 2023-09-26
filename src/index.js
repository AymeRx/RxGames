import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { GameContextProvider } from "./context/gameContext";
import { RoleContextProvider } from "./context/roleContext";
import { VoteContextProvider } from "./context/voteContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <RoleContextProvider>
            <GameContextProvider>
                <VoteContextProvider>
                    <App />
                </VoteContextProvider>
            </GameContextProvider>
        </RoleContextProvider>
    </BrowserRouter>
);