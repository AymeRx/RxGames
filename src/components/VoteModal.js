import React, {useContext, useEffect, useState} from 'react';
import {Table, Form, Container, Row, Col} from 'react-bootstrap';
import {VoteContext} from "../context/voteContext";
import {GameContext} from "../context/gameContext";

export default function VoteModal({ gameVal, setGameVal }) {
    const {getTablePlayerRole, votePoint, statPoint, putVotePointInBase} = useContext(VoteContext);
    const {roleList, setGameState} = useContext(GameContext);

    const [validation, setValidation] = useState("");
    const [players, setPlayers] = useState([]);
    const [vote, setVote] = useState([]);

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
            const dupliVote = vote.copyWithin();

            dupliVote[gameVal.playerInfo.id] = 10;

            if (dupliVote.indexOf(-1) !== players.indexOf(false))
                return setValidation("Il manque un vote chef")

            const pointFromVote = await votePoint(gameVal.gameId, vote);
            const pointFromStat = await statPoint(gameVal.gameId, gameVal.playerInfo.role, gameVal.playerInfo.name, gameVal.playerInfo.id);

            await putVotePointInBase(gameVal.gameId, gameVal.playerInfo.id, pointFromVote + pointFromStat);

            setGameState(gameVal.gameId, "Results");
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
                    <div style={{
                        fontSize: "50px",
                        color: "white",
                        position: 'absolute',
                        top: '6vh',
                        left: '3vw'
                    }}
                    >
                        Votes :
                    </div>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
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
                                {players.map((player, index) => (player !== false && player !== gameVal.playerInfo.name ? (
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
                                    ) : player !== false ? (
                                        <tr key={index}>
                                            <td>{player}</td>
                                            {roles.map((role, roleIndex) => (
                                                <td key={roleIndex}>
                                                    /
                                                </td>
                                            ))}
                                        </tr>
                                    ) : null
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