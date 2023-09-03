import { createContext, useState } from "react"

export const GameContext = createContext();

export function GameContextProvider(props) {


    const [modalState, setModalState] = useState({
        createGameModal: true,
        joinGameModal: false
    });

    const toggleModals = modal => {
        if (modal === "createGame") {
            setModalState({
                createGameModal: true,
                joinGameModal: false
            })
        } else if (modal === "joinGame") {
            setModalState({
                createGameModal: false,
                joinGameModal: true
            })
        } else if (modal === "close") {
            setModalState({
                createGameModal: false,
                joinGameModal: false
            })
        }
    }

    return (
        <GameContext.Provider value={{ modalState, toggleModals }}>
            {props.children}
        </GameContext.Provider>
    )
}