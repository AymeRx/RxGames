import React, {createContext} from "react"
import {db} from "../firebase-config";
import {get, ref, set} from "firebase/database"

export const RoleContext = createContext(null);

export function RoleContextProvider(props) {

    const getPlayerRoleInfo = async (gameId, playerId) => {
        if (gameId === null || playerId === null)
            return;
        try {
            const roleInfoRef = await ref(db, `games/${gameId}/player/${playerId}/roleInfo/`);
            return await get(roleInfoRef);
        } catch (error) {
            console.error("get lover name erreur : ", error);
        }
    };

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array
    }
    const initAmoureux = async (gameId, playerId) => {
        if (gameId === null || playerId === null)
            return;
        try {
            const roleInfoRef = await ref(db, `games/${gameId}/player/${playerId}/roleInfo`);
            let newLoverId = Math.floor(Math.random() * 5);
            while (newLoverId === playerId)
                newLoverId = Math.floor(Math.random() * 5);
            await set(roleInfoRef, {loverId : newLoverId});
        } catch (error) {
            console.error("Init amoureux erreur : ", error);
        }
    };

    const initDoubleFace = async (gameId, playerId) => {
        if (gameId === null || playerId === null)
            return;
        try {
            const roleInfoRef = await ref(db, `games/${gameId}/player/${playerId}/roleInfo`);
            await set(roleInfoRef, {aim : "Win"});
        } catch (error) {
            console.error("Init double face erreur : ", error);
        }
    };

    const initDroide = async (gameId, playerId) => {
        if (gameId === null || playerId === null)
            return;
        try {
            const roleInfoRef = await ref(db, `games/${gameId}/player/${playerId}/roleInfo`);

            const actionList = shuffleArray([
                "Fais une Dominego et dis que ca bug",
                "All in un allié",
                "Insulte ton allié le plus proche",
                "Miaule",
                "Met une oto à l'ennemi le plus proche",
                "Rom sur la lane la plus proche",
                "utilise l'un de tes deux sumoonneur s'il t'en reste un",
                "complimente le premier de la game",
                "vole l'un des camps de ton geungle si tu n'es pas le geungle",
                "rate le prochain canon et plains toi",
                "Fais un combat a mort avec l'adversaire le plus proche",
                "lance un debat à la milo"
            ]);

            await set(roleInfoRef, {action : actionList});
        } catch (error) {
            console.error("Init droide erreur : ", error);
        }
    };


    return (
        <RoleContext.Provider value={{initAmoureux, initDoubleFace, initDroide, getPlayerRoleInfo}}>
            {props.children}
        </RoleContext.Provider>
    )
}