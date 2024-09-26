import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import ChessBoard from './components/ChessBoard.jsx';
import UserInterface from './components/UserInterface.jsx';

import { GameState } from './components/GameLogic/GameState.jsx';


function App() {
  const [gameState, setGameState] = useState(new GameState());
  const [movesForCurrentPiece, setMovesForCurrentPiece] = useState([]);
  const [currentlySelectedPiece, setCurrentlySelectedPiece] = useState(null);


  function initialiseChessBoard()
  {
    let _gameState = new GameState();
    let enemyType = document.getElementById("enemySelect").value;
    let enemyPlaysAs = document.getElementById("enemyPlayAs").value;
    _gameState.init(enemyType, enemyPlaysAs);

    setGameState(_gameState);

  }

  function selectTile(tileID)
  {
    if(gameState.enemyType != "player" && gameState.turnOf == gameState.enemyPlaysAs)
    {
      return;
    }

    if(gameState.turnOf == "white won" || gameState.turnOf == "black won")
    {
      return;
    }

    let numID = tileID.split("Tile")[1];
 

    if(currentlySelectedPiece != null)
    {
    
  
      let thisPos = gameState.tileIDToPosition(numID);
      if(movesForCurrentPiece.some((pos) =>  pos.isEqualTo(thisPos)
      ))
      {
   
        gameState.movePiece(currentlySelectedPiece, thisPos);
        setCurrentlySelectedPiece(null);
        setMovesForCurrentPiece([]);
        return;
      }
    }


    let currentPiece = gameState.findPieceByTileID(numID)
    
    
    if(currentPiece != null)
    {
      if(currentPiece.color == gameState.turnOf)
      {
        let possibleMovePositions = gameState.findAvailableMovesForPiece(currentPiece, true);
        setMovesForCurrentPiece(possibleMovePositions);
        setCurrentlySelectedPiece(currentPiece);
      }

    

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
