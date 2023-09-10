import React, {useContext, useState} from 'react'
import {GameContext} from '../context/gameContext'

export default function StartGameModal({ gameVal, setGameVal }) {

    const { nextEmptySeat, setGameState } = useContext(GameContext);

    const [validation, setValidation] = useState("");

    const handleForm = async (e) => {
        e.preventDefault()

        try {
            const nbPlayer = await nextEmptySeat(gameVal.gameId);

            // if (nbPlayer !== -1)
            //     return setValidation("Le lobby est pas full : " + nbPlayer + " joueurs sur 5");

            setGameState(gameVal.gameId, "Started");
            setGameVal({
                  gameId : gameVal.gameId,
                  gameState : "Started",
                  playerInfo : gameVal.playerInfo
              }
            );

            setValidation("");
        } catch (error) {
            console.log(error)
            setValidation(error)
        }
    }

    return (
        <>
            {gameVal.gameId != null && gameVal.gameState === "Pending" ? (
                <div className="position-absolute top-50 start-50 translate-middle">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className='modal-body'>
                                <form onSubmit={handleForm} className='creater-game-form'>
                                    <p className='text-danger mt-1'>{validation}</p>
                                    <button className="btn btn-danger ms-2">Lancer la game</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    )
}
