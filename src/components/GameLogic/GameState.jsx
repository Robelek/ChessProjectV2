
import { Piece } from "./Piece";
import { Vector2 } from "./Misc/Vector2";

export class GameState
{
    constructor()
    {
        this.turnOf = "game not started";
        this.pieces = [];

        //squaresTaken holds 0 for empty, 1 for white, 2 for black
        this.colorNum = {
            "empty": 0,
            "white": 1,
            "black":2,
        }

        this.squaresTaken = [];

        for(let y=0;y<8;y++)
        {
            let thisRow = [];
            for(let x=0;x<8;x++)
            {
                thisRow.push(this.colorNum.empty);

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
       

       for(let x=0;x<8;x++)
       {
        for(let y of [0, 1, 6, 7])
        {
            if(y == 0 || y == 1)
            {
                this.squaresTaken[y][x] = this.colorNum.black;
            }
            else
            {
                this.squaresTaken[y][x] = this.colorNum.white;
            }
            
        }
        
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
        return this.squaresTaken[pos.y][pos.x] == this.colorNum.empty;
    }

    getEnemyColorOfPiece(piece)
    {
        return piece.color == "white" ? "black" : "white";
    }

    movePiece(piece, newPosition)
    {
        let oldPosition = piece.position;

        let pieceAtThatPosition = this.findPieceByPosition(newPosition);

        if(pieceAtThatPosition !== null)
        {
            this.pieces = this.pieces.filter((thatPiece) => 
            {
                return !thatPiece.position.isEqualTo(newPosition);
            }
            )
        }

        this.squaresTaken[oldPosition.y][oldPosition.x] = this.colorNum.empty;
        this.squaresTaken[newPosition.y][newPosition.x] = this.colorNum[piece.color];

        piece.position = newPosition;

        this.turnOf = this.turnOf == "white" ? "black" : "white";

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

        let enemyColor = this.getEnemyColorOfPiece(piece);

        //captures, we check diagonals
        for(let x=-1;x<2;x+=2)
        {
            let pos = new Vector2(position.x + x, position.y + multip);
            if(this.isInsideBoard(pos) && this.squaresTaken[pos.y][pos.x] == this.colorNum[enemyColor])
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

        let enemyColor = this.getEnemyColorOfPiece(piece);

        for(let mulA = -1; mulA <= 1; mulA += 2)
        {
            for(let mulB = -1; mulB <= 1; mulB += 2)
            {

                
                let pos1 = position.add(new Vector2(2*mulA, mulB));
                let pos2 = position.add(new Vector2(mulA, 2*mulB));

                let poses = [pos1, pos2];

            

                for(let i =0;i<=1;i++)
                {
                    let thisPos = poses[i];
                    if(this.isInsideBoard(thisPos))
                    {
                        if(this.isEmpty(thisPos) || this.squaresTaken[thisPos.y][thisPos.x] == this.colorNum[enemyColor])
                        {
                            possibleMoves.push(thisPos);
                        }
                    
                        
                        
                        
                    }
    
                   
                }
               

           
             
                
            }
        }


        return possibleMoves;
    }


    findMovesForBishop(piece)
    {
        let position = piece.position;
        let possibleMoves = [];

        let enemyColor = this.getEnemyColorOfPiece(piece);

        for(let mulA = -1; mulA<2;mulA+=2)
        {

            for(let mulB=-1; mulB<2;mulB+=2)
            {
             
                let pos = piece.position;

                for(let i = 0; i<8; i++)
                {   
                    pos = pos.add(new Vector2(mulA, mulB));

                    if(this.isInsideBoard(pos))
                    {
                        if(this.isEmpty(pos))
                        {
                            possibleMoves.push(pos);
                        }
                        else
                        {
                            if(this.squaresTaken[pos.y][pos.x] == this.colorNum[enemyColor])
                            {
                                possibleMoves.push(pos);
                               
                            }
                            break;
                        } 
                    }
                }
                
            }


            

        }

        return possibleMoves;

    
    }


    findMovesForTower(piece)
    {
        let possibleMoves = [];
        let enemyColor = this.getEnemyColorOfPiece(piece);

        let directions = [
            new Vector2(-1, 0),
            new Vector2(1, 0),
            new Vector2(0, -1),
            new Vector2(0, 1),
        ]

        for(let dir of directions)
        {
            let pos = piece.position;

            for(let i=0; i<8;i++)
            {
                pos = pos.add(dir);

                if(this.isInsideBoard(pos))
                    {
                        if(this.isEmpty(pos))
                        {
                            possibleMoves.push(pos);
                        }
                        else
                        {
                            if(this.squaresTaken[pos.y][pos.x] == this.colorNum[enemyColor])
                            {
                                possibleMoves.push(pos);
                               
                            }
                            break;
                        } 
                    }
            }
        }

        return possibleMoves;
    }

    findMovesForQueen(piece)
    {
        let towerMoves = this.findMovesForTower(piece);
        let bishopMoves = this.findMovesForBishop(piece);

        let possibleMoves = towerMoves.concat(bishopMoves);

        return possibleMoves;
    }

    findMovesForKing(piece)
    {
        let possibleMoves = [];
        let enemyColor = this.getEnemyColorOfPiece(piece);


        for(let x = -1; x<2;x+=1)
        {
            for(let y=-1; y<2;y+=1)
            {
                if(x == 0 && y == 0)
                {
                    continue;
                }

                let pos = piece.position.add(new Vector2(x, y));

                if(this.isInsideBoard(pos))
                    {
                        if(this.isEmpty(pos))
                        {
                            possibleMoves.push(pos);
                        }
                        else
                        {
                            if(this.squaresTaken[pos.y][pos.x] == this.colorNum[enemyColor])
                            {
                                possibleMoves.push(pos);
                               
                            }
                            break;
                        } 
                    }
            }
        }
        return possibleMoves;
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
            case "tower":
                firstPassMoves = this.findMovesForTower(piece);
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