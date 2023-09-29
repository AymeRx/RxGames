import React, {createContext, useContext} from "react"
import {db} from "../firebase-config";
import {get, ref, set} from "firebase/database"
import {GameContext} from "./gameContext";

export const VoteContext = createContext(null);

export function VoteContextProvider(props) {
    const {roleList} = useContext(GameContext);

    const getTablePlayerRole = async (gameId) => {
        if (gameId === null)
            return;
        try {
            const playersRole = []
            for (let i = 0; i < 5; i++) {
                const playerRef = await ref(db, `games/${gameId}/player/${i}`);
                const player = await get(playerRef);
                playersRole.push({name : player.val().name, role : player.val().role});
            }
            return playersRole;
        } catch (error) {
            console.error("peux pas recuperer les roles et les jouers ", error);
        }
    };

    const votePoint = async (gameId, vote) => {
        if (!gameId || !vote)
            return "Pas bon les parametres"
        const tablePlayerRole = await getTablePlayerRole(gameId);
        let points = 0;

        for (let i = 0; i < 5; i++) {
            if (vote[i] === roleList.map(e => e[0]).indexOf(tablePlayerRole[i].role))
                points++;
        }
        return points
    }

    const statPoint = async (gameId, role, name, playerId) => {
        if (!gameId || !role)
            return 84;

        try {
            const statsRef = await ref(db, `games/${gameId}/stats/`)
            const stats = (await get(statsRef)).val();

            switch (role) {
                case "Imposteur":
                    return stats.win === true ? 1 : 0;
                case "Droide":
                    return 0;
                case "Serpentin":
                    return stats.moreDeath === name && stats.moreDamage === name ? 2 : stats.moreDeath === name || stats.moreDamage === name ? 1 : 0;
                case "Double-face":
                    const aimRef = await ref(db, `games/${gameId}/player/${playerId}/roleInfo/aim`)
                    const aim = (await get(aimRef)).val()
                    return aim === "Win" && stats.win ? 1 : 0;
                case "Super-héros":
                    return stats.moreDeath === name && stats.moreDamage === name ? 2 : stats.moreDeath === name || stats.moreDamage === name ? 1 : 0;
                case "Amoureux":
                    return
                default:
                    return 84;
            }
        } catch (error) {
            console.error(error)
            return 84;
        }
    }

    const pushEndStats = async (gameId, stats) => {
        if (gameId == null || stats == null)
            return;

        try {
            const statsRef = await ref(db, `games/${gameId}/stats/`);
            await set(statsRef, stats);
        } catch (e) {
            console.error(e)
        }
    };

    const putVotePointInBase = async (gameId, playerId, point) => {
        if (gameId == null || playerId == null || point == null)
            return;

        try {
            const pointsRef = await ref(db, `games/${gameId}/player/${playerId}/points/`);
            await set(pointsRef, point);
        } catch (e) {
            console.error(e)
        }
    };

    return (
        <VoteContext.Provider value={{getTablePlayerRole, votePoint, putVotePointInBase, pushEndStats, statPoint}}>
            {props.children}
        </VoteContext.Provider>
    )
}