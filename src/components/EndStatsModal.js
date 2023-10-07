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
        death: null
    });

    const handleForm = async (e) => {
        e.preventDefault();

        try {
            pushEndStats(gameVal.gameId, stats);
            setGameVal((prevGameVal) => ({
                ...prevGameVal,
                stats: stats,
                gameState: 'Vote'
            }));
            setGameState(gameVal.gameId, 'Vote');
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
                        death: [0, 0, 0, 0, 0]
                    })
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des rôles et des joueurs ', error);
            }
        }
        fetchData();
    }, [gameVal.gameId, getTablePlayerRole, gameVal.gameState]);

    return (
        <>
            {gameVal.gameState === 'End' && stats.death != null ? gameVal.playerInfo.id === 0 ? (
                <Form onSubmit={handleForm} className='creater-game-form'>
                    <div style={{
                        fontSize: "50px",
                        color: "white",
                        position: 'absolute',
                        top: '8vh',
                        left: '2vw'
                    }}
                    >
                        Le joueur 1 doit rentrer les stats (pour les points) :
                    </div>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
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
                            {players.map((player) => (player !== false ? (
                                <option key={player} value={player}>
                                    {player}
                                </option>
                            ) : null))}
                        </Form.Control>
                    </Form.Group>
                    <br/>
                    <Form.Group controlId='Nombre de morts : '>
                        <Form.Label style={{ color: "white" }}>Nombre de morts :</Form.Label>
                        {players.map((player, index) => (player !== false ? (
                            <Form.Group key={index} controlId={`Nombre de morts pour ${player}`}>
                                <Form.Label style={{ color: "white" }}>Morts de {player} :</Form.Label>
                                <Form.Control
                                    key={player}
                                    type="number"
                                    placeholder={`Nombre de morts pour ${player}`}
                                    value={stats.death[index]}
                                    onChange={(e) => {
                                        const newDeaths = [...stats.death]; // Créez une copie du tableau
                                        newDeaths[index] = parseInt(e.target.value) || 0;
                                        setStats((prevStats) => ({
                                            ...prevStats,
                                            death: newDeaths,
                                        }));
                                    }}
                                />
                            </Form.Group>
                        ) : null ))}
                    </Form.Group>
                    <Form.Group controlId='Le plus de morts : '>
                        <Form.Label style={{color:"white"}}>Le plus de morts : </Form.Label>
                        <Form.Control
                            as='select'
                            value={stats.moreDeath}
                            onChange={(e) => setStats((prevStats) => ({...prevStats, moreDeath: e.target.value}))}
                        >
                            {players.map((player) => (player !== false ? (
                                <option key={player} value={player}>
                                    {player}
                                </option>
                            ) : null))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='Le plus de dégâts : '>
                        <Form.Label style={{color:"white"}}>Le plus de dégâts : </Form.Label>
                        <Form.Control
                            as='select'
                            value={stats.moreDamage}
                            onChange={(e) => setStats((prevStats) => ({...prevStats, moreDamage: e.target.value}))}
                        >
                            {players.map((player) => (player !== false ? (
                                <option key={player} value={player}>
                                    {player}
                                </option>
                            ) : null))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="Le plus d'assists : ">
                        <Form.Label style={{color:"white"}}>Le plus d'assists : </Form.Label>
                        <Form.Control
                            as='select'
                            value={stats.moreAssist}
                            onChange={(e) => setStats((prevStats) => ({...prevStats, moreAssist: e.target.value}))}
                        >
                            {players.map((player) => (player !== false ? (
                                <option key={player} value={player}>
                                    {player}
                                </option>
                            ) : null))}
                        </Form.Control>
                    </Form.Group>
                    <p className='text-danger mt-1'>{validation}</p>
                    <Button variant='danger' type='submit' className='ms-2'>
                        Confirmer les stats
                    </Button>
                </Form>
            ) : (
                <div className="position-absolute top-50 start-50 translate-middle">
                    <p className='text-danger mt-1'>En attente du joueur 1 : {players.at(0)}</p>
                </div>
            ) : null}
        </>
    );
}
