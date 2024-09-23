
function GameOverPopup(props) {
    

    if(props.winner != null)
    {
        return (
            <div className="gameOverPopup">
                <div className="whoWon">
                    {props.winner} won!
                </div>
            </div>
           
         )
        
    }
    else
    {
        return (<></>);
    }
     
    }
    
    export default GameOverPopup
    