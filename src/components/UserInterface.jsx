function UserInterface(props) {
    return (
      <div className="gameUIBottomLeft">
          <div className="TurnOfDisplay"> Turn of: {props.gameState.turnOf}</div>
          <button onClick={props.initFunction} className="NewGameButton"> New game </button>
      </div>
  
    );
  }
  
  export default UserInterface;
  