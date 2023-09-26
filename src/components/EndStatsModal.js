import React, { useContext, useEffect, useState } from 'react';
import { VoteContext } from '../context/voteContext';
import { GameContext } from '../context/gameContext';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function EndStatsModal({ gameVal, setGameVal }) {
    const { getTablePlayerRole, pushEndStats } = useContext(VoteContext);
    const { setGameState } = useContext(GameContext);

    const [validation, setValidation] = useState('');
    const [players, setPlayers] = useState([]);
    const [stats, setStats] = useState({
        win: null,
        moreKill: null,
        moreDamage: null,
        moreAssist: null,
        moreDeath: null,
    });

    const handleForm = async (e) => {
        e.preventDefault();

        try {
            console.log('SATAS :', stats);

            setGameState(gameVal.gameId, 'Vote');
            setGameVal((prevGameVal) => ({
                ...prevGameVal,
                gameState: 'Vote',
            }));
            pushEndStats(gameVal.gameId, stats);
            setValidation('');
        } catch (error) {
            console.error(error);
            setValidation(error);
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const playersRole = await getTablePlayerRole(gameVal.gameId);
                if (playersRole) {
                    setPlayers(playersRole.map((e) => e.name));
                    setStats({
                        win: true,
                        moreKill: playersRole[0].name,
                        moreDamage: playersRole[0].name,
                        moreAssist: playersRole[0].name,
                        moreDeath: playersRole[0].name,
                    })
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des rôles et des joueurs ', error);
            }
        }
        fetchData();
    }, [gameVal.gameId, getTablePlayerRole]);

    return (
        <>
            {gameVal.gameState === 'End' ? (
                <Form onSubmit={handleForm} className='creater-game-form'>
                    <Form.Group controlId='Victoire ou defaite : '>
                        <Form.Label style={{color:"white"}}>Victoire ou defaite : </Form.Label>
                        <Form.Control
                            as='select'
                            value={stats.win}
                            onChange={(e) => setStats((prevStats) => ({...prevStats, win: e.target.value}))}
                        >
                            <option value={true}>
                                Victoire
                            </option>
                            <option value={false}>
                                Defaite
                            </option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='Le plus de kills : '>
                        <Form.Label style={{color:"white"}}>Le plus de kills : </Form.Label>
                        <Form.Control
                            as='select'
                            value={stats.moreKill}
                            onChange={(e) => setStats((prevStats) => ({...prevStats, moreKill: e.target.value}))}
                        >
                            {players.map((player) => (
                                <option key={player} value={player}>
                                    {player}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='Le plus de morts : '>
                        <Form.Label style={{color:"white"}}>Le plus de morts : </Form.Label>
                        <Form.Control
                            as='select'
                            value={stats.moreDeath}
                            onChange={(e) => setStats((prevStats) => ({...prevStats, moreDeath: e.target.value}))}
                        >
                            {players.map((player) => (
                                <option key={player} value={player}>
                                    {player}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='Le plus de dégâts : '>
                        <Form.Label style={{color:"white"}}>Le plus de dégâts : </Form.Label>
                        <Form.Control
                            as='select'
                            value={stats.moreDamage}
                            onChange={(e) => setStats((prevStats) => ({...prevStats, moreDamage: e.target.value}))}
                        >
                            {players.map((player) => (
                                <option key={player} value={player}>
                                    {player}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="Le plus d'assists : ">
                        <Form.Label style={{color:"white"}}>Le plus d'assists : </Form.Label>
                        <Form.Control
                            as='select'
                            value={stats.moreAssist}
                            onChange={(e) => setStats((prevStats) => ({...prevStats, moreAssist: e.target.value}))}
                        >
                            {players.map((player) => (
                                <option key={player} value={player}>
                                    {player}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <p className='text-danger mt-1'>{validation}</p>
                    <Button variant='danger' type='submit' className='ms-2'>
                        Confirmer les stats
                    </Button>
                </Form>
            ) : null}
        </>
    );
}
