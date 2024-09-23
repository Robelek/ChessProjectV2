
function GameOverPopup(props) {

    if(props.winner != null)
    {
        return (
            <div className="gameOverPopup">
                <div className="whoWon">
                    <span>
                        {props.winner} won!
                    </span>
                   
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
    