import React, {useContext, useEffect, useState} from 'react';
import { Table, Container, Row, Col } from 'react-bootstrap';
import {VoteContext} from "../context/voteContext";

import Imposteur from "../assets/Imposteur.png";
import Droide from "../assets/Droide.png";
import Serpentin from "../assets/Serpentin.png";
import Double from "../assets/Double-face.png";
import Super from "../assets/Super-héros.png";
import Amoureux from "../assets/Amoureux.png";

export default function ResultsModal({ gameVal, setGameVal }) {
    const {getTablePlayerRole} = useContext(VoteContext);

    const [players, setPlayers] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const playersRole = await getTablePlayerRole(gameVal.gameId);
                if (playersRole) {
                    setPlayers(playersRole);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des rôles et des joueurs ", error);
            }
        }
        fetchData();
    }, [gameVal.gameId, getTablePlayerRole, gameVal.gameState]);

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
            {gameVal.gameState === "Results" && players !== null ? (
                <Container>
                    <div style={{
                        fontSize: "50px",
                        color: "white",
                        position: 'absolute',
                        top: '6vh',
                        left: '3vw'
                    }}
                    >
                        Resultats :
                    </div>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <Col>
                        <Row>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    {players.map((player, index) => (
                                        <th key={index}
                                            style={{
                                                fontSize: "27px"
                                            }}
                                        >
                                            {player.name}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    {players.map((player, index) => (
                                        <td key={index}
                                            style={{
                                                fontSize: "27px"
                                            }}
                                        >
                                            {player.role}
                                            <img
                                                src={rolePicturPath(player.role)}
                                                alt={player.role}
                                                style={{
                                                    width: "10000px",
                                                    maxWidth: "100%",
                                                    height: "auto",
                                                    display: "block",
                                                    margin: "0 auto",
                                                }}
                                            />
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    {players.map((player, index) => (
                                        <td key={index}
                                            style={{
                                                fontSize: "27px"
                                            }}
                                        >
                                            {player.points}
                                        </td>
                                    ))}
                                </tr>
                                </tbody>
                            </Table>
                        </Row>
                    </Col>
                </Container>
            ) : null}
        </>
    )
}