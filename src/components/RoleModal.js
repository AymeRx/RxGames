import React, {useEffect} from 'react'
import {onValue, ref} from "firebase/database";
import {db} from "../firebase-config";

import Imposteur from "../assets/Imposteur.png";
import Droide from "../assets/Droide.png";
import Serpentin from "../assets/Serpentin.png";
import Double from "../assets/Double-face.png";
import Super from "../assets/Super-héros.png";
import Amoureux from "../assets/Amoureux.png";

export default function RoleModal({ gameVal, setGameVal }) {

    useEffect(() => {
        const gameRef = ref(db, `games/${gameVal.gameId}/player/${gameVal.playerInfo.id}/role`);

        const unsubscribe = onValue(gameRef, (snapshot) => {
            const newRole = snapshot.val();
            setGameVal((prevGameVal) => ({
                ...prevGameVal,
                playerInfo : {
                    ...prevGameVal.playerInfo,
                    role : newRole
                }
            }));
        });

        return () => {
            unsubscribe();
        };
    }, [gameVal.gameState, gameVal.gameId, gameVal.playerInfo.id, setGameVal]);

    const rolePicturPath = (role) => {
        switch (role) {
            case "Imposteur":
                return Imposteur
            case "Droide":
                return Droide
            case "Serpentin":
                return Serpentin
            case "Double-face":
                return Double
            case "Super-héros":
                return Super
            case "Amoureux":
                return Amoureux
            default:
                return null
        }
    };

    return (
        <>
            {gameVal.playerInfo.role != null && gameVal.gameState === "Started" ? (
                <div className="position-fixed top-0 vw-100 vh-100">
                    <img
                        src={rolePicturPath(gameVal.playerInfo.role)}
                        alt={gameVal.playerInfo.role}
                        style={{
                            maxHeight: "66vh",
                            maxWidth: "33vw",
                            position: 'absolute',
                            top: '10vh',
                            left: '5vw',
                        }}
                    />
                </div>
            ) : null}
        </>
    )
}
