import Tile from "./ChessBoardComponents/Tile"
import { Vector2 } from "./GameLogic/Misc/Vector2";

function ChessBoard(props) {
    let tiles = []

    for(let y=0;y<8;y++)
    {
      for(let x=0;x<8;x++)
      {
        let color = "white";
        let id = y*8+x;

        let colorMultip = y%2 ? 1 : -1;
        let secondColorMultip = x%2 ? 1: -1;
        
        if(colorMultip * secondColorMultip == -1)
        {
          color="black";
        }

        let piece = props.gameState.findPieceByPosition(new Vector2(x, y));
        

        tiles.push(<Tile key={id} color={color} pieceHere={piece}> </Tile>);
      }
    }
      
    


    return (
        <div className="ChessBoard">
          {tiles}
        </div>
      
    )
  }
  
  export default ChessBoard
  