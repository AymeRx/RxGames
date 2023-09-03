import React, { useContext } from 'react'
import { GameContext } from '../context/gameContext'

export default function CreateGameModal() {
  const { modalState, toggleModals } = useContext(GameContext);
  return (
    <>
      {modalState.createGameModal && (
        <div className="position-fixed top-0 vw-100 vh-100">
          <div onClick={() => toggleModals("close")} className="w-100 h-100 bg-dark bg-opacity-75"></div>
          <div className="position-absolute top-50 start-50 translate-middle">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className='modal-body'>
                  <button onClick={() => toggleModals("close")} className="btn btn-primary">Rester dans ce lobby</button>
                  <button className="btn btn-danger ms-2">Créer une nouvelle game</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
