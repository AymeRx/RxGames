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
                const roleRef = await ref(db, `games/${gameId}/player/${i}/role/`);
                const role = await get(roleRef);
                const nameRef = await ref(db, `games/${gameId}/player/${i}/name/`);
                const name = await get(nameRef);
                playersRole.push({name : name.val(), role : role.val()});
            }
            return playersRole;
        } catch (error) {
            console.error("peux pas recuperer les roles et les jouers ", error);
        }
    };

    const votePoint = async (vote, gameId) => {
        const tablePlayerRole = await getTablePlayerRole(gameId);
        let points = 0;

        for (let i = 0; i < 5; i++) {
            if (vote[i] === roleList.map(e => e[0]).indexOf(tablePlayerRole[i].role))
                points++;
        }
        return points
    }

    const pushEndStats = async (gameId, stats) => {
        if (gameId == null || stats == null)
            return;

        try {
            const statsRef = await ref(db, `games/${gameId}/`);
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
        <VoteContext.Provider value={{getTablePlayerRole, votePoint, putVotePointInBase, pushEndStats}}>
            {props.children}
        </VoteContext.Provider>
    )
}