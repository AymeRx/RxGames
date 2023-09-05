import { createContext, useState } from "react"
import { db } from "../firebase-config";
import { ref, set, push, child, get } from "firebase/database"

export const GameContext = createContext();

export function GameContextProvider(props) {

    const doesGameExist = async (gameId) => {
        const gameRef = ref(db, `games/${gameId}`);

        try {
            const snapshot = await get(gameRef);
            return snapshot.exists();
        } catch (error) {
            console.error("Erreur lors de la vérification de l'existence de la game :", error);
            return false;
        }
    };

    const createGame = async () => {
        try {
            const gamesRef = ref(db, "games");
            push(gamesRef);

            let newGameId;

            do {
                newGameId = Math.floor(Math.random() * 9000) + 1000;
            } while (await doesGameExist(newGameId));

            const gameData = {
                name: `Game ${newGameId}`,
                score: 0,
            };

            await set(child(gamesRef, newGameId), gameData);
            return newGameId;
        } catch (error) {
            console.log("Erreur lors de la création du jeu :", error);
            return error;
        }
    };

    const joinGame = async (gameId) => {
        try {
            if (doesGameExist(gameId))
                return gameId;
            return 0;
        } catch (error) {
            console.log("Ca peut pas join : ", error);
            return error;
        }
    };

    const [modalState, setModalState] = useState({
        createGameModal: false,
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
        <GameContext.Provider value={{ modalState, toggleModals, createGame, joinGame }}>
            {props.children}
        </GameContext.Provider>
    )
}