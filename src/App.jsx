import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import ChessBoard from './components/ChessBoard.jsx';
import UserInterface from './components/UserInterface.jsx';

import { GameState } from './components/GameLogic/GameState.jsx';


function App() {
  const [gameState, setGameState] = useState(new GameState());

  function initialiseChessBoard()
  {
    let _gameState = new GameState();
    _gameState.init();

    setGameState(_gameState);

  }

  return (

      <main>
          <ChessBoard gameState = {gameState}></ChessBoard>
          <UserInterface initFunction = {initialiseChessBoard} gameState={gameState}></UserInterface>
      </main>
    
  )
}

export default App
