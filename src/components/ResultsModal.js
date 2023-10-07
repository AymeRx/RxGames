import React, {useContext, useEffect, useState} from 'react';
import { Table, Container, Row, Col } from 'react-bootstrap';
import {VoteContext} from "../context/voteContext";

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

    return (
        <>
            {gameVal.gameState === "Results" && players !== null ? (
                <Container>
                    <Col>
                        <Row>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    {players.map((player, index) => (
                                        <th key={index}>{player.name}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    {players.map((player, index) => (
                                        <td key={index}>{player.role}</td>
                                    ))}
                                </tr>
                                <tr>
                                    {players.map((player, index) => (
                                        <td key={index}>{player.points}</td>
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