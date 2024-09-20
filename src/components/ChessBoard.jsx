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

        let position = new Vector2(x, y)
        let piece = props.gameState.findPieceByPosition(position);

        let possibleMove = false;


        if(props.movesForCurrentPiece != null)
        {
          for(let i = 0; i < props.movesForCurrentPiece.length; i++)
          {

            
            if(props.movesForCurrentPiece[i].isEqualTo(position))
            {
  
              possibleMove = true;
              break;
            }
          }

            
        }
       

        tiles.push(<Tile key={id} id={"Tile"+id} color={color} pieceHere={piece} selectTile={props.selectTile} possibleMove={possibleMove}> </Tile>);
      }
    }
      
   


    return (
        <div className="ChessBoard">
          {tiles}
        </div>
      
    )
  }
  
  export default ChessBoard
  