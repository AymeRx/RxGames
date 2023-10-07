import React, {useContext, useState} from 'react'
import {GameContext} from '../context/gameContext'

export default function StartGameModal({ gameVal, setGameVal }) {

    const { nextEmptySeat, setGameState } = useContext(GameContext);

    const [validation, setValidation] = useState("");

    const startGame = async() => {

        try {
            const nbPlayer = await nextEmptySeat(gameVal.gameId);

            if (nbPlayer === 0)
                return setValidation("Le lobby est pas full : " + nbPlayer + " joueurs sur 5");

            setGameState(gameVal.gameId, "Started");
            setGameVal({
                    gameId : gameVal.gameId,
                    gameState : "Started",
                    playerInfo : gameVal.playerInfo
                }
            );

            setValidation("");
        } catch (error) {
            console.error(error)
            setValidation(error)
        }
    }

    return (
        <>
            {gameVal.gameId != null && gameVal.gameState === "Pending" ? (
                <div className="position-absolute top-50 start-50 translate-middle">
                    <div style={{
                        fontSize: "50px",
                        color: "white",
                        position: 'absolute',
                        top: '6vh',
                        left: '3vw'
                    }}
                    >
                        Clique pour démarrer la partie (assure toi que tout le monde à bien rejoint) :
                    </div>
                    <p className='text-danger mt-1'>{validation}</p>
                    <button onClick={() => startGame()} className="btn btn-danger ms-2">Lancer la game</button>
                </div>
            ) : null}
        </>
    )
}
