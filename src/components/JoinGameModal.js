import React, { useContext, useRef, useState } from 'react'
import { GameContext } from '../context/gameContext'

export default function JoinGameModal({ gameVal, setGameVal }) {

    const { modalState, toggleModals, doesGameExist, nextEmptySeat, putPlayerInSeatIndex, quitGame } = useContext(GameContext);

    const [validation, setValidation] = useState("");

    const codeRef = useRef(null);
    const nameRef = useRef(null);

    const handleForm = async (e) => {
        e.preventDefault();
        const newGameCode = codeRef.current.value;
        const newName = nameRef.current.value;

        try {
            if (newGameCode.length !== 4)
                return setValidation("Le code d'une game contient 4 chiffres");

            if (newName.length <= 2)
                return setValidation("Il est court ton pseudo frr");

            if (!await doesGameExist(newGameCode))
                return setValidation("La game n'existe pas chef");

            const nextSeat = await nextEmptySeat(newGameCode);
            if (nextSeat === -1)
                return setValidation("La game est pleine chef");

            quitGame(gameVal.gameId, gameVal.playerInfo.name);
            putPlayerInSeatIndex(newGameCode, newName, nextSeat);
            setGameVal({
                gameId : newGameCode,
                gameState : "Pending",
                playerInfo : {
                    name : newName,
                    id : nextSeat,
                    role : null,
                    vote : null
                }
            });
            closeModal();
        } catch (error) {
            console.error(error);
            setValidation(error);
        }
    }

    const closeModal = () => {
        setValidation("");
        toggleModals("close");
    };

    return (
        <>
            {modalState.joinGameModal && (
                <div className="position-fixed top-0 vw-100 vh-100">
                    <div style={{
                        fontSize: "50px",
                        color: "white",
                        position: 'absolute',
                        top: '6vh',
                        left: '3vw'
                    }}
                    >
                        Rejoindre une Partie avec un code :
                    </div>
                    <div onClick={closeModal} className="w-100 h-100 bg-dark bg-opacity-75"></div>
                    <div className="position-absolute top-50 start-50 translate-middle">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className='modal-body'>
                                    <form onSubmit={handleForm} className='creater-game-form'>
                                        <input placeholder="Code de la game" id={"name"} autoComplete={"username"} ref={codeRef} type="number" />
                                        <input placeholder="Nom du joueur" id={"codeGame"} autoComplete={"off"} ref={nameRef} type="Text" />
                                        <p className='text-danger mt-1'>{validation}</p>
                                        <button onClick={closeModal} className="btn btn-primary">Rester dans ce lobby</button>
                                        <button className="btn btn-danger ms-2">Rejoindre cette game</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
