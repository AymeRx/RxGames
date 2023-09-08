import React, { useState } from 'react';
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import Navbar from "./components/Navbar";
import CreateGameModal from "./components/CreateGameModal";
import JoinGameModal from "./components/JoinGameModal";

function App() {
  const [gameId, setGameId] = useState(null);
  const [playerName, setPlayerName] = useState(null);

  const handleSetPlayerName = (newPlayerName) => {
    setPlayerName(newPlayerName);
    localStorage.setItem("playerName", newPlayerName);
  };

  const handleSetGameId = (newGameId) => {
    setGameId(newGameId);
    localStorage.setItem("gameId", newGameId);
  };

  return (
    <>
      <CreateGameModal gameId={gameId} playerName={playerName} setGameId={handleSetGameId} setPlayerName={handleSetPlayerName} />
      <JoinGameModal gameId={gameId} playerName={playerName} setGameId={handleSetGameId} setPlayerName={handleSetPlayerName} />
      <Navbar gameId={gameId} playerName={playerName} />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
