import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import ChessBoard from './components/ChessBoard.jsx';
import UserInterface from './components/UserInterface.jsx';

import { GameState } from './components/GameLogic/GameState.jsx';


function App() {
  const [gameState, setGameState] = useState(new GameState());
  const[movesForCurrentPiece, setMovesForCurrentPiece] = useState([]);
  let currentlySelectedPieceID = null;


  function initialiseChessBoard()
  {
    let _gameState = new GameState();
    _gameState.init();

    setGameState(_gameState);

  }

  function selectTile(tileID)
  {
    let numID = tileID.split("Tile")[1];

    if(currentlySelectedPieceID != null)
    {
      let thisPos = gameState.tileIDToPosition(numID);



    }


    let pieceHere = gameState.findPieceByTileID(numID);
   
    
    if(pieceHere != null)
    {
      currentlySelectedPieceID = pieceHere.id;
      let possibleMovePositions = gameState.findAvailableMovesForPiece(pieceHere);
      setMovesForCurrentPiece(possibleMovePositions);
    }
    else
    {
      setMovesForCurrentPiece([]);
    }

    


  }


  return (

      <main>
          <ChessBoard gameState = {gameState} selectTile = {selectTile} movesForCurrentPiece={movesForCurrentPiece}></ChessBoard>
          <UserInterface initFunction = {initialiseChessBoard} gameState={gameState}></UserInterface>
      </main>
    
  )
}

export default App
