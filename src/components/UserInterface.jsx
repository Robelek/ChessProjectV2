function UserInterface(props) {
    return (
      <div className="gameUIBottomLeft">
          <div className="TurnOfDisplay"> Turn of: {props.gameState.turnOf}</div>

          <div className="optionSelects">
          Enemy will be:
          <select id="enemySelect" defaultValue={"smartAI"}> 
            <option value="player">
              Player
            </option>

            <option value="randomAI">
              Random moves
            </option>

            <option value="smartAI">
              Smart AI
            </option>

          </select>


          Enemy will play as:
          <select id="enemyPlayAs"> 
          <option value="black">
              Black
            </option>
            
            <option value="white">
              White
            </option>

            
          </select>


        </div>
         

          <button onClick={props.initFunction} className="NewGameButton"> New game </button>

          <button onClick={props.unmakeMove} className="NewGameButton"> Undo last move </button>
      </div>
  
    );
  }
  
  export default UserInterface;
  