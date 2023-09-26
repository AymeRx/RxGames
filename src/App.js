import React, { useState } from 'react';
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import Navbar from "./components/Navbar";
import CreateGameModal from "./components/CreateGameModal";
import JoinGameModal from "./components/JoinGameModal";
import StartGameModal from "./components/StartGameModal"
import GameStateUpdater from "./components/GameStateUpdater"
import RoleModal from "./components/RoleModal"
import VoteModal from "./components/VoteModal";
import EndStatsModal from "./components/EndStatsModal";

function App() {

    const [gameVal, setGameVal] = useState({
        gameId : null,
        gameState : null,
        playerInfo : {
            name : null,
            id : null,
            role : null,
            vote : null,
            roleInfo : null,
        }
    });

    return (
        <>
            <StartGameModal gameVal={gameVal} setGameVal={setGameVal} />
            <GameStateUpdater gameVal={gameVal} setGameVal={setGameVal} />
            <RoleModal gameVal={gameVal} setGameVal={setGameVal}/>
            <Navbar gameVal={gameVal} setGameVal={setGameVal} />
            <VoteModal gameVal={gameVal} setGameVal={setGameVal} />
            <EndStatsModal gameVal={gameVal} setGameVal={setGameVal} />
            <CreateGameModal gameVal={gameVal} setGameVal={setGameVal} />
            <JoinGameModal gameVal={gameVal} setGameVal={setGameVal} />
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </>
    );
}

export default App;
