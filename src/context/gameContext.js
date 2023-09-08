import {createContext, useState} from "react"
import {db} from "../firebase-config";
import {child, get, push, ref, set} from "firebase/database"

export const GameContext = createContext(null);

export function GameContextProvider(props) {
    const putPlayerInSeatIndex = async (gameId, playerName, seatIndex) => {
        try {
            const seatRef = ref(db, `games/${gameId}/player/${seatIndex}/name/`);
            await set(seatRef, playerName);
        } catch (error) {
            console.error("Tu peux pas join c'est bizzare :", error);
        }
        return -1;
    }

    const nextEmptySeat = async (gameId) => {
        try {
            const gameRef = ref(db, `games/${gameId}`);

            const gameSnapshot = await get(gameRef);
            const gameData = gameSnapshot.val();

            for (let nextSeat = 0; nextSeat <= 4; nextSeat++) {
                console.log(gameData.player[nextSeat].name);
                if (gameData.player[nextSeat].name !== false)
                    continue;
                return nextSeat;
            }
        } catch (error) {
            console.error("Tu peux pas join c'est bizzare :", error);
        }
        return -1;
    }

    const quitGame = async (gameId, playerName) => {
        if (gameId === null || playerName === null)
            return;
        try {
            const gameRef = ref(db, `games/${gameId}`);

            const gameSnapshot = await get(gameRef);
            const gameData = gameSnapshot.val();

            const playerIndex = gameData.player.findIndex(
                (player) => player.name === playerName
            );

            if (playerIndex !== -1) {
                gameData.player[playerIndex] = {
                    name: false,
                    role: false,
                    vote: false,
                };
                await set(gameRef, gameData);
            } else {
                console.error("Tu peux pas quitter une game dans laquelle tu n'es pas");
            }
        } catch (error) {
            console.error("Erreur lors de la réinitialisation du joueur :", error);
        }
    };

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

            const playerData = {
                name: false,
                role: false,
                vote: false,
            };

            const gameData = {
                player: Array.apply(null, Array(5)).map(function () { return playerData }),
            };

            await set(child(gamesRef, newGameId.toString()), gameData);
            return newGameId;
        } catch (error) {
            console.log("Erreur lors de la création du jeu :", error);
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
        <GameContext.Provider value={{ modalState, toggleModals, createGame, doesGameExist, nextEmptySeat, putPlayerInSeatIndex, quitGame }}>
            {props.children}
        </GameContext.Provider>
    )
}