import React, { useContext, useRef, useState } from 'react'
import { GameContext } from '../context/gameContext'

export default function JoinGameModal() {

  const { modalState, toggleModals, joinGame } = useContext(GameContext);

  const [validation, setValidation] = useState("");

  const inputs = useRef([]);
  const addInputs = e => {
    if (e && !inputs.current.includes(e)) {
      inputs.current.push(e);
    }
  }

  const formRef = useRef();

  const handleForm = async (e) => {
    e.preventDefault()
    if (inputs.current[0].value.length !== 4) {
      setValidation("Le code d'une game contient 4 chiffres")
      return;
    }
    try {
      const cred = joinGame(inputs.current[0].value);
      if (cred === inputs.current[0].value) {
        setValidation("");
        toggleModals("close");
      } else if (cred === 0) {
        setValidation("La game n'existe pas");
      } else {
        console.log(cred);
        setValidation(cred);
      }
    } catch (error) {
      setValidation(error);
    }
  }

  const closeModal = () => {
    setValidation("");
    toggleModals("close");
  };

  return (
    <>
      {modalState.joinGameModal && (
        <div className="position-fixed top-0 vw-100 vh-100">
          <div onClick={closeModal} className="w-100 h-100 bg-dark bg-opacity-75"></div>
          <div className="position-absolute top-50 start-50 translate-middle">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className='modal-body'>
                  <form
                    ref={formRef}
                    onSubmit={handleForm} className='creater-game-form'>
                    <input placeholder="Code de la game" ref={addInputs} type="number" />
                    <p className='text-danger mt-1'>{validation}</p>
                    <button onClick={closeModal} className="btn btn-primary">Rester dans ce lobby</button>
                    <button className="btn btn-danger ms-2">Rejoindre cette game</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
