import React, { useContext } from 'react'
import { GameContext } from '../context/gameContext'
import { Link } from "react-router-dom"

export default function Navbar({ gameVal }) {
    const { toggleModals } = useContext(GameContext);
    return (
        <nav className="navbar navbar-light bg-light px-4">
            <Link to="/" className="navbar-brand">
                Among Legends : Game : {gameVal.gameId} : {gameVal.playerInfo.name}
            </Link>
            <div>
                <button onClick={() => toggleModals("createGame")} className='btn btn-primary'>
                    Créer une game
                </button>
                <button onClick={() => toggleModals("joinGame")} className='btn btn-primary ms-2'>
                    Rejoindre une game
                </button>
            </div>
        </nav>
    )
}
