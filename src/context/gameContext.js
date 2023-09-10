import React, {createContext, useState} from "react"
import {db} from "../firebase-config";
import {child, get, push, ref, set} from "firebase/database"

export const GameContext = createContext(null);

export function GameContextProvider(props) {

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array
    }

    const roleList = [
        "Imposteur",
        "Droide",
        "Serpentin",
        "Double-face",
        "Super-héros",
        "Amoureux",
    ];

    const generateRoles = async (gameId) => {
        try {
            const rolesToAssign = shuffleArray(roleList.copyWithin());
            while (rolesToAssign.length > 5)
                rolesToAssign.pop();
            if (rolesToAssign.indexOf("Imposteur") === -1)
                rolesToAssign[1] = "Imposteur";
            if (rolesToAssign.indexOf("Super-héros") === -1)
                rolesToAssign[2] = "Super-héros";
            shuffleArray(rolesToAssign);
            for (let i = 0; i < 5; i++) {
                const roleRef = ref(db, `games/${gameId}/player/${i}/role/`);
                await set(roleRef, rolesToAssign[i]);
            }
        } catch (error) {
            console.error("Erreur à la création des roles", error);
        }
    }

    const putPlayerInSeatIndex = async (gameId, playerName, seatIndex) => {
        try {
            const seatRef = ref(db, `games/${gameId}/player/${seatIndex}/name/`);
            await set(seatRef, playerName);
        } catch (error) {
            console.error("Tu peux pas join c'est bizzare :", error);
        }
    }

    const nextEmptySeat = async (gameId) => {
        try {
            const gameRef = ref(db, `games/${gameId}`);

            const gameSnapshot = await get(gameRef);
            const gameData = gameSnapshot.val();

            for (let nextSeat = 0; nextSeat <= 4; nextSeat++) {
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
                    points: 0
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
        try {
            const gameRef = ref(db, `games/${gameId}`);
            const snapshot = await get(gameRef);
            return snapshot.exists();
        } catch (error) {
            console.error("Erreur lors de la vérification de l'existence de la game :", error);
            return false;
        }
    };

    const setGameState = async (gameId, gameState) => {
        try {
            const gameRef = ref(db, `games/${gameId}`);

            const gameSnapshot = await get(gameRef);
            const gameData = gameSnapshot.val();
            gameData.gameState = gameState;

            await set(gameRef, gameData);

            return true;
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
                points: 0
            };

            const gameData = {
                player: Array.apply(null, Array(5)).map(function () { return playerData }),
            };

            await set(child(gamesRef, newGameId.toString()), gameData);

            await setGameState(newGameId, "Pending");
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
        <GameContext.Provider value={{ modalState, toggleModals, createGame, doesGameExist, nextEmptySeat, putPlayerInSeatIndex, quitGame, setGameState, generateRoles }}>
            {props.children}
        </GameContext.Provider>
    )
}