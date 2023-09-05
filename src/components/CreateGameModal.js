import React, { useContext, useState } from 'react'
import { GameContext } from '../context/gameContext'

export default function CreateGameModal() {

  const { modalState, toggleModals, createGame } = useContext(GameContext);

  const [validation, setValidation] = useState("");

  const handleForm = async (e) => {
    e.preventDefault()
    try {
      const cred = await createGame();
      localStorage.setItem("gameId", cred.toString())
      setValidation("");
      toggleModals("close");
    } catch (error) {
      console.log(error)
      setValidation(error)
    }
  }

  const closeModal = () => {
    setValidation("");
    toggleModals("close");
  };

  return (
    <>
      {modalState.createGameModal && (
        <div className="position-fixed top-0 vw-100 vh-100">
          <div onClick={closeModal} className="w-100 h-100 bg-dark bg-opacity-75"></div>
          <div className="position-absolute top-50 start-50 translate-middle">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className='modal-body'>
                  <form
                    onSubmit={handleForm} className='creater-game-form'>
                    <p className='text-danger mt-1'>{validation}</p>
                    <button onClick={closeModal} className="btn btn-primary">Rester dans ce lobby</button>
                    <button className="btn btn-danger ms-2">Créer une nouvelle game</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div >
      )
      }
    </>
  )
}
