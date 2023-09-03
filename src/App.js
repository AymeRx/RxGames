import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import Navbar from "./components/Navbar";
import CreateGameModal from "./components/CreateGameModal";
import JoinGameModal from "./components/JoinGameModal";

function App() {
  return (
    <>
      <JoinGameModal />
      <CreateGameModal />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
