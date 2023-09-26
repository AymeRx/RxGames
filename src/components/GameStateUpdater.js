import { useEffect } from 'react'
import { ref, onValue } from "firebase/database";
import { db } from "../firebase-config";
export default function GameStateUpdater({ gameVal, setGameVal }) {

    useEffect(() => {
        const gameRef = ref(db, `games/${gameVal.gameId}/gameState`);

        const unsubscribe = onValue(gameRef, (snapshot) => {
            const gameStateData = snapshot.val();
            setGameVal((prevGameVal) => ({
                ...prevGameVal,
                gameState: gameStateData,
            }));
        });

        return () => {
            unsubscribe();
        };
    }, [gameVal.gameId, setGameVal]);

    return null;
}