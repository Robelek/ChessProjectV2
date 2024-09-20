
import { Piece } from "./Piece";
import { Vector2 } from "./Misc/Vector2";

export class GameState
{
    constructor()
    {
        this.turnOf = "game not started";
        this.pieces = [];

        this.squaresTaken = [];

        for(let y=0;y<8;y++)
        {
            let thisRow = [];
            for(let x=0;x<8;x++)
            {
                thisRow.push(false);

            }
            this.squaresTaken.push(thisRow);
        }
    };

    init()
    {
        this.turnOf = "white";
        this.pieces = [];


        this.pieces.push(

        new Piece("black", "tower", new Vector2(0,0)),
        new Piece("black", "horse", new Vector2(1,0)),
        new Piece("black", "bishop", new Vector2(2,0)),
        new Piece("black", "queen", new Vector2(3,0)),
        new Piece("black", "king", new Vector2(4,0)),
        new Piece("black", "bishop", new Vector2(5,0)),
        new Piece("black", "horse", new Vector2(6,0)),
        new Piece("black", "tower", new Vector2(7,0)),
        
        new Piece("white", "tower", new Vector2(0,7)),
        new Piece("white", "horse", new Vector2(1,7)),
        new Piece("white", "bishop", new Vector2(2,7)),
        new Piece("white", "queen", new Vector2(4,7)),
        new Piece("white", "king", new Vector2(3,7)),
        new Piece("white", "bishop", new Vector2(5,7)),
        new Piece("white", "horse", new Vector2(6,7)),
        new Piece("white", "tower", new Vector2(7,7)), 

        )

       for(let x=0;x<8;x++)
       {
            this.pieces.push(new Piece("white", "pawn", new Vector2(x,6)));
            this.pieces.push(new Piece("black", "pawn", new Vector2(x,1)));
       }
    


    }

    findPieceByTileID(id)
    {
        let pos = this.tileIDToPosition(id);
        return this.findPieceByPosition(pos);
    }

    findPieceByPosition(position)
    {
        for(let i=0;i<this.pieces.length;i++)
        {
            if(this.pieces[i].position.isEqualTo(position))
            {
                return this.pieces[i];
            }
        }
        return null;
    }

    tileIDToPosition(tileID)
    {

        let y = Math.floor(tileID/8);
        let x = tileID - y*8;

        return new Vector2(x, y);
    }

    
    isInsideBoard(pos)
    {
        return pos.x >=0 && pos.x < 8 && pos.y >=0 && pos.y < 8;
    }

    isEmpty(pos)
    {
        return !this.squaresTaken[pos.y][pos.x];
    }

    findMovesForPawn(piece)
    {
        let position = piece.position;
        let initialPosition = piece.initialPosition;

        let multip = piece.color == "white" ? -1 : 1;

        let possibleMoves = [];

        if(position == initialPosition)
        {
          
            for(let i = 1; i<=2;i++)
            {
                let pos = new Vector2(position.x, position.y + i*multip);
                if(this.isEmpty(pos))
                {
                    possibleMoves.push(pos);
                }
                else
                {
        
                    break;
                }
            }

      
           
         

        
        }
        else
        {
            let pos = new Vector2(position.x, position.y + multip);
            if(this.isInsideBoard(pos) && this.isEmpty(pos))
            {
                possibleMoves.push(pos);
            }

       
        }

        return possibleMoves;
    }

    findMovesForHorse(piece)
    {
        let position = piece.position;
        let possibleMoves = [];

        for(let mulA = -1; mulA <= 1; mulA += 2)
        {
            for(let mulB = -1; mulB <= 1; mulB += 2)
            {
                let pos1 = position.add(new Vector2(2*mulA, mulB));
                let pos2 = position.add(new Vector2(mulA, 2*mulB));
                if(this.isInsideBoard(pos1))
                {
                    possibleMoves.push(pos1);
                }

                if(this.isInsideBoard(pos2))
                {
                    possibleMoves.push(pos2);
                }

           
             
                
            }
        }


        return possibleMoves;
    }


    findMovesForBishop(piece)
    {
        let position = piece.position;
        let possibleMoves = [];

    
    }


    findAvailableMovesForPiece(piece)
    {

        let firstPassMoves = [];
        let availableMoves = [];

        switch(piece.type)
        {
            case "pawn":
                firstPassMoves = this.findMovesForPawn(piece);
                break;
            case "horse":
                firstPassMoves = this.findMovesForHorse(piece);
                break;
            case "bishop":
                firstPassMoves = this.findMovesForBishop(piece);
                break;
            case "rook":
                firstPassMoves = this.findMovesForRook(piece);
                break;
            case "queen":
                firstPassMoves = this.findMovesForQueen(piece);
                break;
            case "king":
                firstPassMoves = this.findMovesForKing(piece);
                break;
            default:
                window.alert("How the heck?!");
                break;
        }

        availableMoves = firstPassMoves;

        return availableMoves;

    }


}