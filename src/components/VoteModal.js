import React, {useContext, useEffect, useState} from 'react';
import { Table, Form, Container, Row, Col } from 'react-bootstrap';
import {VoteContext} from "../context/voteContext";
import {GameContext} from "../context/gameContext";

export default function VoteModal({ gameVal, setGameVal }) {
    const {getTablePlayerRole, votePoint, putVotePointInBase} = useContext(VoteContext);
    const {roleList} = useContext(GameContext);

    const [validation, setValidation] = useState("");
    const [players, setPlayers] = useState([]);
    const [vote, setVote] = useState([-1, -1, -1, -1, -1]);

    const handleVoteClick = (index, roleIndex) => {
        const newVote = vote.map((c, i) => {
            if (i === index)
                return roleIndex;
            return c;
        })
        setVote(newVote);
    };

    const handleForm = async (e) => {
        e.preventDefault();

        try {
            if (vote.includes(-1))
                return setValidation("Il manque un vote chef")

            const pointFromVote = await votePoint(vote, gameVal.gameId);
            await putVotePointInBase(gameVal.gameId, gameVal.playerInfo.id, pointFromVote);

            setGameVal((prevGameVal) => ({
                ...prevGameVal,
                gameState: "Results",
                playerInfo: {
                    ...prevGameVal.playerInfo,
                    points: pointFromVote
                }
            }));
            setValidation("");
        } catch (error) {
            console.error(error);
            setValidation(error);
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const playersRole = await getTablePlayerRole(gameVal.gameId);
                if (playersRole) {
                    setPlayers(playersRole.map(e => e.name));
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des rôles et des joueurs ", error);
            }
        }
        fetchData();
        setVote([-1, -1, -1, -1, -1]);
    }, [gameVal.gameId, getTablePlayerRole]);

    const roles = roleList.map(e => e[0]);

    return (
        <>
            {gameVal.gameState === "Vote" ? (
                <Container>
                    <Row>
                        <Col>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th></th>
                                    {roles.map((role, index) => (
                                        <th key={index}>{role}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {players.map((player, index) => (
                                    <tr key={index}>
                                        <td>{player}</td>
                                        {roles.map((role, roleIndex) => (
                                            <td key={roleIndex}>
                                                <Form.Check
                                                    type="radio"
                                                    name={`vote-${index}`}
                                                    onChange={() => handleVoteClick(index, roleIndex)}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <form onSubmit={handleForm} className='creater-game-form'>
                                <p className='text-danger mt-1'>{validation}</p>
                                <button className="btn btn-danger ms-2">Confirmer le vote</button>
                            </form>
                        </Col>
                    </Row>
                </Container>
            ) : null}
        </>
    )
}