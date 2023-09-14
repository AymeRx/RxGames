import React, {useContext, useEffect, useState} from 'react'
import {onValue, ref} from "firebase/database";
import {db} from "../firebase-config";
import { GameContext } from '../context/gameContext';

import Imposteur from "../assets/Imposteur.png";
import Droide from "../assets/Droide.png";
import Serpentin from "../assets/Serpentin.png";
import Double from "../assets/Double-face.png";
import Super from "../assets/Super-héros.png";
import Amoureux from "../assets/Amoureux.png";

export default function RoleModal({gameVal, setGameVal}) {

    const {getPlayerNameById} = useContext(GameContext);

    const [currentIndexRole, setCurrentIndexRole] = useState(0);

    useEffect(() => {
        const gameRef = ref(db, `games/${gameVal.gameId}/player/${gameVal.playerInfo.id}/role`);
        const unsubscribeRole = onValue(gameRef, async (snapshot) => {
            const newRole = snapshot.val();
            setGameVal((prevGameVal) => ({
                ...prevGameVal,
                playerInfo: {
                    ...prevGameVal.playerInfo,
                    role: newRole,
                }
            }));
        });
        return () => {unsubscribeRole();};
    }, [gameVal.gameId, gameVal.playerInfo.id, setGameVal]);

    useEffect(() => {
        const gameRef = ref(db, `games/${gameVal.gameId}/player/${gameVal.playerInfo.id}/roleInfo`);
        const unsubscribeRoleInfo = onValue(gameRef, async (snapshot) => {
            let newRoleInfo = snapshot.val();
            switch (gameVal.playerInfo.role) {
                case "Amoureux":
                    newRoleInfo.loverName = await getPlayerNameById(gameVal.gameId, newRoleInfo.loverId);
                    break;
                default:
                    break;
            }
            setGameVal((prevGameVal) => ({
                ...prevGameVal,
                playerInfo: {
                    ...prevGameVal.playerInfo,
                    roleInfo: newRoleInfo,
                }
            }));
        });
        return () => {unsubscribeRoleInfo();};
    }, [gameVal.gameId, gameVal.playerInfo.id, gameVal.playerInfo.role, setGameVal, getPlayerNameById]);

    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            const synth = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'fr-FR';
            synth.speak(utterance);
        } else {
            console.error("La synthèse vocale n'est pas prise en charge par ce navigateur.");
        }
    };

    useEffect(() => {
        if (currentIndexRole >= 0 && gameVal.gameState === "Started" && gameVal.playerInfo.roleInfo) {
            const actions = gameVal.playerInfo.roleInfo.action;
            if (actions && currentIndexRole >= 1) {
                speakText(actions[currentIndexRole % actions.length]);
            }
        }
    }, [currentIndexRole, gameVal.gameState, gameVal.playerInfo.roleInfo]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (gameVal.gameState === "Started")
                setCurrentIndexRole((prevIndex) => (prevIndex + 1));
            }, (Math.floor(Math.random() * 5 + 5)) * 60 * 1000);
        // }, 6 * 1000);
        return () => clearInterval(intervalId);
    }, [gameVal.gameState]);

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

    const roleDescrpition = (role) => {
        switch (role) {
            case "Imposteur":
                return "Imposteur : Faire perdre la game sans se faire démasquer"
            case "Droide":
                return "Droide : Gagner la game en suivant les instructions reçues"
            case "Serpentin":
                return "Serpentin : Gagner la game en ayant le plus de morts et de dégâts de sa team"
            case "Double-face":
                return "Double-face : Change de rôle aléatoirement. Doit gagner la game en tant que gentil ou perdre en imposteur\n\n"
            case "Super-héros":
                return "Super-héros : Gagner la game en ayant le plus de dégâts, d'assistances et de kills. Gravement pénalisé en cas de défaite"
            case "Amoureux":
                return "Amoureux : Tu dois mourir chaque fois que ton amoureux décede, par compassion. Le nom du chanceux est "
                    + gameVal.playerInfo.roleInfo.loverName + "🥰"
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
                    <p style={{color: "white", fontSize: "30px", position: 'absolute', top: '10vh', left: '45vw'}}>
                        {roleDescrpition(gameVal.playerInfo.role)}
                        <br/><br/>
                        {currentIndexRole ? (gameVal.playerInfo.roleInfo.action[currentIndexRole % gameVal.playerInfo.roleInfo.action.length]) : null}
                    </p>
                </div>
            ) : null}
        </>
    )
}
