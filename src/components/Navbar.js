import React, { useContext } from 'react'
import { GameContext } from '../context/gameContext'
import { Link } from "react-router-dom"

export default function Navbar({ gameVal }) {
    const { toggleModals } = useContext(GameContext);
    const copierDansLePressePapier = (texte) => {
        const textarea = document.createElement("textarea");
        textarea.value = texte;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert(`"${texte}" a été copié dans le presse-papiers.`);
    };

    return (
        <nav className="navbar navbar-light bg-light px-4">
            <Link to="/" className="navbar-brand">
                Among Legends
            </Link>
            <div>
                <button onClick={() => copierDansLePressePapier(gameVal.gameId)} className='btn btn-outline-dark ms-2'>
                    Game : {gameVal.gameId}
                </button>
                <button onClick={() => copierDansLePressePapier(gameVal.playerInfo.name)} className='btn btn-outline-dark ms-2'>
                    Nom : {gameVal.playerInfo.name}
                </button>
                <button onClick={() => toggleModals("createGame")} className='btn btn-primary ms-2'>
                    Créer une game
                </button>
                <button onClick={() => toggleModals("joinGame")} className='btn btn-primary ms-2'>
                    Rejoindre une game
                </button>
            </div>
        </nav>
    )
}
