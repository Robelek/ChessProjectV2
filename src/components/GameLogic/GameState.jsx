
import { Piece } from "./Piece";
import { Vector2 } from "./Misc/Vector2";
import { MinMaxEval } from "./MinMaxEval";
import { cloneDeep } from "lodash";


export class GameState
{
    constructor()
    {
        this.turnOf = "game not started";
        this.pieces = [];

        this.enemyType = "player";
        this.enemyPlaysAs = "black";

        this.lastMovedPiece = null;

        this.pawnToPromote = null;
        this.endTurnData = null;

        this.minmaxEvaluator = new MinMaxEval();

        this.movesList = [];

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

    deepCopy(gameState) {
        let newGameState = new GameState();
        newGameState.turnOf = gameState.turnOf;
        newGameState.pieces = [];
        newGameState.enemyType = gameState.enemyType;
        newGameState.enemyPlaysAs = gameState.enemyPlaysAs
       newGameState.lastMovedPiece = gameState.lastMovedPiece;
       newGameState.pawnToPromote = gameState.pawnToPromote;
        
        for(let y=0; y<8; y++)
        {
            for(let x=0;x<8;x++)
            {
                newGameState.squaresTaken[y][x] = gameState.squaresTaken[y][x];
            }
        }

        for(let i = 0; i<gameState.pieces.length;i++)
        {
            let thatPiece = gameState.pieces[i];
            let newPiece = new Piece(thatPiece.color, thatPiece.type, thatPiece.initialPosition);
            newPiece.position = new Vector2(thatPiece.position.x, thatPiece.position.y);
            newPiece.hasMoved = thatPiece.hasMoved;
            newPiece.lastPosition = thatPiece.lastPosition;
            newPiece.initialPosition = thatPiece.initialPosition;

            newGameState.pieces.push(newPiece);
        }

        newGameState.movesList = cloneDeep(this.movesList);

        return newGameState;
    }

    init(_enemyType, _enemyPlaysAs)
    {
        this.turnOf = "white";
        this.pieces = [];
        this.enemyType = _enemyType;
        this.enemyPlaysAs = _enemyPlaysAs

        this.movesList = [];

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
    
       for(let x=0; x<8;x++)
       {
        for(let y=0;y<8;y++)
        {
            this.squaresTaken[y][x] = this.colorNum.empty;
        }
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

       if(this.enemyPlaysAs == "white")
       {
        if(this.enemyType == "randomAI" )
        {
            this.randomAITurn();
        }
        else if (this.enemyType == "smartAI")
        {
            this.minmaxTurn();
        }
       }
     


    }


    

    //returns number from 0 to max!
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }

      

    
    randomAITurn()
    {
        if(this.turnOf != this.enemyPlaysAs)
        {
            return;
        }

        let possibleMoves = this.getAllAvailableMovesFor(this.enemyPlaysAs);
        
        if(possibleMoves != [])
        {
            let randomNum = this.getRandomInt(possibleMoves.length-1);

        
       

            let thatPiece = possibleMoves[randomNum].piece;
            let thatPos = possibleMoves[randomNum].position;
    
            this.movePiece(thatPiece, thatPos, true);
        }

      

    }


    minmaxTurn()
    {
        let isMaximizing = this.enemyPlaysAs == "white" ? 1 : 0;
       
        let depth = 4;

        let boardClone = this.deepCopy(this);
        
        let move = this.minmax(boardClone, depth, depth, -Infinity, Infinity, isMaximizing);

     
        let realPiece = this.findPieceByPosition(move.from);

        this.movePiece(realPiece, move.position, true);


        if(this.endTurnData != null)
        {
            //hardcoded queen promotion for now
            this.promotePiece("queen");
        }
       

    }

    minmax(gameState, startingDepth, depthLeft, alpha, beta, isMaximizing)
    {


        if(depthLeft <= 0 || (gameState.turnOf != "white" && gameState.turnOf != "black"))
        {
          return this.minmaxEvaluator.evaulate(gameState);
        }

        let possibleMoves = gameState.getAllAvailableMovesFor(gameState.turnOf);

        if(isMaximizing)
        {
            let bestOne = -Infinity;
            let bestMove = possibleMoves[0];
            for(let move of possibleMoves)
            {
                let pieceAtThatPosition = gameState.findPieceByPosition(move.from);
                gameState.movePiece(pieceAtThatPosition, move.position, true);
                let evaluation = gameState.minmax(gameState, startingDepth, depthLeft - 1, alpha, beta, !isMaximizing);
                gameState.unmakeMove();

                if(bestOne < evaluation)
                {
                    bestMove = move;
                    bestOne = evaluation;
                }

                alpha =  Math.max(alpha, evaluation);
                if(beta <= alpha)
                {
                    break;
                }
            }

            if(depthLeft == startingDepth)
            {
                return bestMove;
            }
            else
            {
                return bestOne;
            }
           
        }
        else
        {
            let bestOne = Infinity;
            let bestMove = possibleMoves[0];
            for(let move of possibleMoves)
            {

                let pieceAtThatPosition = gameState.findPieceByPosition(move.from);
                gameState.movePiece(pieceAtThatPosition, move.position, true);
                let evaluation = gameState.minmax(gameState, startingDepth, depthLeft - 1, alpha, beta, !isMaximizing);
                gameState.unmakeMove();
       

                if(bestOne > evaluation)
                {
                    bestMove = move;
                    bestOne = evaluation;
                }

                beta =  Math.min(beta, evaluation);
                if(beta <= alpha)
                {
                    break;
                }
            }
            if(depthLeft == startingDepth)
                {
                    return bestMove;
                }
                else
                {
                    return bestOne;
                }
        }

    }

    getAllAvailableMovesFor(color)
    {
        let possibleMoves = [];
        for(let i=0;i<this.pieces.length;i++)
        {
            if(this.pieces[i].color == color)
            {

                let pieceMoves = this.findAvailableMovesForPiece(this.pieces[i], true);

                for(let j=0;j<pieceMoves.length;j++)
                {
                    possibleMoves.push(
                        {
                            "piece": this.pieces[i],
                            "position": pieceMoves[j],
                            "from": this.pieces[i].position
                        }
                    )
                }

            }
        }

        return possibleMoves;
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

    positionToTileID(position)
    {
        let y = position.y;
        let x = position.x;

        return y*8 + x;
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

  
    
    movePiece(piece, newPosition, dontCheckMore=false, dontCheckForGameOver=false)
    {

        let wasCastling = false;
        let wasEnPassant = false;
        let capturedWhat = null;
        let hasCapturedMoved = false;
    

        let oldPosition = piece.position;

        let pieceAtThatPosition = this.findPieceByPosition(newPosition);

        if(pieceAtThatPosition !== null)
        {
            if(piece.type == "king" && pieceAtThatPosition.type=="tower" && piece.color == pieceAtThatPosition.color)
            {
                //we are actually castling, so let's teleport the tower and change the newPosition to the correct one

                let mul = pieceAtThatPosition.position.x > piece.position.x ? 1 : -1;
                
                newPosition = piece.position.add(new Vector2(2*mul, 0));

                let oldRookPosition = pieceAtThatPosition.position;
                let newRookPosition = newPosition.add(new Vector2(-mul, 0));

                this.squaresTaken[oldRookPosition.y][oldRookPosition.x] = this.colorNum.empty;
                this.squaresTaken[newRookPosition.y][newRookPosition.x] = this.colorNum[piece.color];
        
                pieceAtThatPosition.position = newRookPosition;
                pieceAtThatPosition.hasMoved = true;
                pieceAtThatPosition.lastPosition = oldRookPosition;

                wasCastling = true;


            }
            else
            {
           
                hasCapturedMoved = pieceAtThatPosition.hasMoved;
                capturedWhat = pieceAtThatPosition.type;
                
                this.pieces = this.pieces.filter((thatPiece) => 
                    {
                       
                        return !thatPiece.position.isEqualTo(newPosition);
                    }
                    )
            }
         
        }
        else if(this.lastMovedPiece !== null)
        {
            //is empty, but this could still be en passant
            let square = this.getEnPassantSquare(piece, this.lastMovedPiece);
           

            if(square !== null)
            {
                if(square.isEqualTo(newPosition))
                {
                    let thatPiecePos = this.lastMovedPiece.position;
                    this.squaresTaken[thatPiecePos.y][thatPiecePos.x] = this.colorNum.empty;
                    
                    hasCapturedMoved = this.lastMovedPiece.hasMoved;
                    capturedWhat = this.lastMovedPiece.type;

                    this.pieces = this.pieces.filter((thatPiece) => 
                        {
                           
                            return !thatPiece.position.isEqualTo(this.lastMovedPiece.position);
                        }
                        )

                    wasEnPassant = true;
                }
            }
            
        }

        this.squaresTaken[oldPosition.y][oldPosition.x] = this.colorNum.empty;
        this.squaresTaken[newPosition.y][newPosition.x] = this.colorNum[piece.color];


      

        piece.position = newPosition;
        piece.hasMoved = true;
        piece.lastPosition = oldPosition;

        this.lastMovedPiece = piece;
        
        let endTurnDataLocal =  {
            "dontCheckMore":dontCheckMore,
        "dontCheckForGameOver":dontCheckForGameOver
        }
        this.movesList.push(
        {
            "from": oldPosition,
            "to": newPosition,
            "enPassant": wasEnPassant,
            "castling": wasCastling,
            "promotion": false,
            "capturedWhat": capturedWhat,
            "hasCapturedMoved":hasCapturedMoved
        });

        //promotions
        if(piece.type == "pawn")
        {
            if(piece.position.y == 0 || piece.position.y == 7)
            {
                //we don't need to check the color since pawns can only move forward from the second to last rank.
                this.pawnToPromote = piece;
                this.endTurnData = endTurnDataLocal;
                this.movesList.at(-1).promotion = true;
                return;
            }
        }

        //because javascript is stupid, we need to do this in this hacky way to wait for input.
        this.endTurnCallback(
           endTurnDataLocal
        )
    
       

    }

    unmakeMove()
    {

        if(this.movesList.length <= 0)
        {
            return;
        }

        let lastMove = this.movesList.pop();


        let from = lastMove.from;
        let to = lastMove.to;

        let pieceThatMoved = this.findPieceByPosition(to);
        if(pieceThatMoved == null)
        {
            
    
        }


        pieceThatMoved.lastPosition = from;
        pieceThatMoved.position = from;

        this.squaresTaken[to.y][to.x] = this.colorNum.empty;
        this.squaresTaken[from.y][from.x] = this.colorNum[pieceThatMoved.color];

        if(lastMove.capturedWhat != null)
        {
        
            let typeOfCapturedPiece = lastMove.capturedWhat;
            let newPiece = new Piece(this.getEnemyColorOfPiece(pieceThatMoved), typeOfCapturedPiece, to);
            
         

            let enemyColor = this.getEnemyColorOfPiece(pieceThatMoved);

            if(typeOfCapturedPiece == "pawn")
            {
                let startingY = enemyColor == "white"? 6 : 1;
                //it doesn't actually matter if that pawn captured something and changed his x, since the positions only matter if
                //he has not moved yet
                newPiece.initialPosition = new Vector2(to.x, startingY);
                newPiece.hasMoved = lastMove.hasCapturedMoved;

                if(lastMove.wasEnPassant)
                {
                    console.log("was en passant")
                        //if it was en passant, than the position needs to be offset by 1
                    let dir = enemyColor == "white" ? 1: -1;
                    newPiece.position = new Vector2(newPiece.position.x, newPiece.position.y + dir);

                }

              
            }
            if(typeOfCapturedPiece == "rook")
            {
                let startingY = enemyColor == "white"? 7 : 0;
                //it doesn't actually matter if that pawn captured something and changed his x, since the positions only matter if
                //he has not moved yet
                newPiece.initialPosition = new Vector2(to.x, startingY);

                newPiece.hasMoved = lastMove.hasCapturedMoved;
            }
           
            this.squaresTaken[to.y][to.x] = this.colorNum[enemyColor];
      
            
            this.pieces.push(newPiece);
        }


       

        if(lastMove.wasCastling)
        {
            //castling is treated as the king moving, but we also need to move the rook too
            let thatRook = null;
            let wasRightRook = false;
            if(pieceThatMoved.position.x > pieceThatMoved.initialPosition.x)
            {
                wasRightRook = true;
            }

            let xOfInitial = wasRightRook ? 7 : 0;
            let yOfInitial = pieceThatMoved.color == "white" ? 7: 0;
            let wantedInitialPos = new Vector2(xOfInitial, yOfInitial);

            for(let i=0;i<this.pieces.length;i++)
            {
                if(this.pieces[i].initialPosition.isEqualTo(wantedInitialPos))
                {
                    thatRook = this.pieces[i];
                    break;
                }
            }

            thatRook.position = wantedInitialPos;
            thatRook.lastPosition = wantedInitialPos;
            thatRook.initialPosition = wantedInitialPos;
            thatRook.hasMoved = false;

            pieceThatMoved.hasMoved = false;
           

        }

        if(lastMove.promotion)
        {
            pieceThatMoved.type = "pawn";
        }


        if(from == pieceThatMoved.initialPosition)
        {
            pieceThatMoved.hasMoved = false;
        }


        //we also need to switch the turn
        this.turnOf = pieceThatMoved.color;


    }

    promotePiece(toWhatType)
    {
        let position = this.pawnToPromote.position;
        let color = this.pawnToPromote.color;

        this.pieces = this.pieces.filter((thatPiece) => 
            {
                return !thatPiece.position.isEqualTo(position);
            }
            )
        
        let newPiece = new Piece(color, toWhatType, position);
        this.pieces.push(newPiece);

        this.pawnToPromote = null;
        
        console.log("Promotion!");
        this.endTurnCallback(this.endTurnData);

    }



    endTurnCallback(endTurnData)
    {
        this.turnOf = this.turnOf == "white" ? "black" : "white";

        this.endTurnData = null;
   
        if(!endTurnData.dontCheckForGameOver)
        {
            this.checkForGameOver();
        }
        

        if(!endTurnData.dontCheckMore)
        {
            if(this.turnOf == this.enemyPlaysAs)
                {
                    if(this.enemyType == "randomAI")
                    {
                        this.randomAITurn();
                    }
                    if(this.enemyType == "smartAI")
                    {
                        this.minmaxTurn();
                    }
                }
        }
    }

    getEnPassantSquare(piece, thatPiece)
    {
        if(thatPiece.type == "pawn" && piece.type == "pawn" && piece.color != thatPiece.color)
            {
                if(thatPiece.lastPosition == thatPiece.initialPosition)
                {
                    if(Math.abs(thatPiece.position.y - thatPiece.lastPosition.y)==2)
                    {
                        //that piece just made the initial two squares move.
                        if(Math.abs(thatPiece.position.x - piece.position.x) == 1 && thatPiece.position.y == piece.position.y)
                        {
                            //that piece is beside our pawn, meaning we can finally do en passant
                            let mul = thatPiece.initialPosition.y > piece.initialPosition.y ? 1 : -1;
                
                            return thatPiece.position.add(new Vector2(0, mul));

                        }
                    }
                  

                }
            

            }

        return null;
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

        //en passant
        if(this.lastMovedPiece !== null)
        {
            
             

                let square = this.getEnPassantSquare(piece, this.lastMovedPiece);
                if(square !== null)
                {
                    possibleMoves.push(square);
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
            for(let y= -1; y<2;y+=1)
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
                       
                        } 
                    }
            }
        }


        //castling special thingy
        if(!piece.hasMoved)
        {
            let rooks = [
                this.findPieceByPosition(new Vector2(0, piece.position.y)),
                this.findPieceByPosition(new Vector2(7, piece.position.y)),
            ]

            for(let rook of rooks)
            {
                if(rook == null)
                {
                    continue;
                }
                if(!rook.hasMoved)
                {
                    //we check all spaces between them, and if empty, then we can castle
                    let mul = rook.position.x > piece.position.x ? 1 : -1;

                    let pos = piece.position;

                    for(let i=0;i<4;i++)
                    {
                        pos = pos.add(new Vector2(mul, 0));

                        if(pos.isEqualTo(rook.position))
                        {
                            possibleMoves.push(rook.position);
                            break;
                        }

                        if(!this.isInsideBoard(pos))
                        {
                            break;
                        }
                        else if(!this.isEmpty(pos))
                        {
                            break;
                        }
                    }

                }
            }
        }
        
       
        return possibleMoves;
    }

    isKingInCheck(color)
    {
        let kingPiece = null;

        let enemyKnights = [];

        for(let i=0; i<this.pieces.length;i++)
        {
            if(this.pieces[i].type == "king" && this.pieces[i].color == color)
            {
                kingPiece = this.pieces[i];
               
            }
            else if(this.pieces[i].type == "knight" && this.pieces[i].color != color)
            {
                enemyKnights.push(this.pieces[i]);
            }
        }

        if(kingPiece === null)
        {
            console.error("King somehow got lost?!");
            return false;
        }

        //we need to check the knights separately

        for(let i = 0; i<enemyKnights.length;i++)
        {
            let thisKnight = enemyKnights[i];
            let positionDiff = Math.abs(thisKnight.position.x - kingPiece.position.x) + Math.abs(thisKnight.position.y - kingPiece.position.y);
            
            if(positionDiff == 3 && (thisKnight.position.x == 1 || thisKnight.position.x == 2))
            {
                return true;
            } 
        }

        let dirMultiplier = color == "white" ? -1 : 1;
        let enemyColor = this.getEnemyColorOfPiece(kingPiece);

        for(let x=-1;x<2;x++)
        {
            for(let y=-1;y<2;y++)
            {
                if(x==0&&y==0)
                {
                    continue;
                }
                else
                {
                    let pos = kingPiece.position;
                    let dir = new Vector2(x,y);
                    for(let i=0;i<8;i++)
                    {
                        pos = pos.add(dir);

                        if(!this.isInsideBoard(pos) || this.squaresTaken[pos.y][pos.x] == this.colorNum[color])
                        {
                            break;
                        }
                        else
                        {
                            if(this.squaresTaken[pos.y][pos.x] == this.colorNum[enemyColor])
                                {
                                    //there is an enemy here. We know we can safely break this direction, but we need to determine if it is attacking us
                                    let enemyPiece = this.findPieceByPosition(pos);
                                    if(enemyPiece == null)
                                    {
                                        console.log("something dumb has happened");
                                        continue;
                                        
                                    }

                                    let enemyPieceType = enemyPiece.type;

                                   
                                    if(x == 0 || y == 0)
                                    {
                                        //left/right/up/down, we only care about the enemy Queen and Towers.
                                        if(enemyPieceType == "queen" || enemyPieceType == "tower")
                                        {
                                            return true;
                                        }
                                    }
                                    else
                                    {
                                        //diagonal
                                        if(y == dirMultiplier && x != 0)
                                        {
                                            //special case where we also care for pawns, since they attack us, but this only works
                                            //if literally next to us, so we need to check it
                                            if(enemyPieceType == "pawn" && i ==0)
                                            {
                                                return true;
                                            }
                                        }
            
            
                                        if(enemyPieceType == "queen" || enemyPieceType == "bishop")
                                        {
                                            return true;
                                        }
                                    }
                                    break;
                                }
                        }

                        
                    }

                   
                }
                

            }
        }


        return false;

        
    }

    checkForGameOver()
    {
            //basically, if the king is not in check then this function returns null
            //after that, we need to check for all staleMate possibilities. Otherwise everything is fine.
        
           if(this.checkForMate() === null)
           {
                if(this.checkForStaleMate())
                {
                    this.turnOf = "stalemate";
                }
           }

    }

    checkForStaleMate()
    {
        let whitePieces = []
        let blackPieces = [];

        for(let i =0;i<this.pieces.length;i++)
        {
            if(this.pieces[i].color == "white")
            {
                whitePieces.push(this.pieces[i]);
            }
            else if(this.pieces[i].color == "black")
            {
                blackPieces.push(this.pieces[i]);
            }
        }

        let whiteHasMatingPower = this.hasMatingPower(whitePieces);
        let rightHasMatingPower = this.hasMatingPower(blackPieces);

        
        if(!whiteHasMatingPower && !rightHasMatingPower)
        {
            return true;
        }
        else
        {
            //there is still a possibility this is a stalemate, tends to happen if only pawns are left and they are blocking each other and the king
           if(this.getAllAvailableMovesFor(this.turnOf) == [])
           {
                return true;
           }


            
        }
        return false;
    }

    //what we count as mating power is according to (impossibility of checkmate): https://en.wikipedia.org/wiki/Draw_(chess)

    //ergo, impossible combinations are solely:
    //- king 
    //- king and one bishop
    //- king and one knight

    hasMatingPower(colorPieces)
    {
        let bishopCounter = 0;
        let knightCounter = 0;

        for(let i = 0; i<colorPieces.length;i++)
        {
           switch(colorPieces.type)
           {
            case "king":
                break;
            case "bishop":
                bishopCounter += 1;
                break;
            case "knight":
                knightCounter += 1;
                break;
            default:
                return true;
           }

           if(bishopCounter + knightCounter > 1)
           {
            return true;
           }
        }
        return false;
    }


    checkForMate()
    {
    
        if(this.isKingInCheck(this.turnOf))
        {
          
            for(let i = 0; i < this.pieces.length;i++)
            {
                let piece = this.pieces[i];
      
                if(piece.color == this.turnOf)
                {
                  
                    let movesAvailable = this.findAvailableMovesForPiece(piece, true);
    
                    if(movesAvailable.length > 0)
                    {
                        return false;
                    }
                }
            }


            this.turnOf = this.turnOf == "white" ? "black won" : "white won";

            return true;
        }
        

        return null;
    }

    forceSavingKing(piece, possibleMoves)
    {


        let newPossibleMoves = [];
        for(let i=0;i<possibleMoves.length;i++)
        {
          
            let originalTurnColor = this.turnOf;

             this.movePiece(piece, possibleMoves[i], true, true);
      
        
            if(!this.isKingInCheck(originalTurnColor))
            {
                newPossibleMoves.push(possibleMoves[i]);
            }
            
            this.unmakeMove();
     
      
           
            
        }
        return newPossibleMoves;
    }


    findAvailableMovesForPiece(piece, withAdditionalChecks=false)
    {
      
   
        let availableMoves = [];

        switch(piece.type)
        {
            case "pawn":
                availableMoves = this.findMovesForPawn(piece);
                break;
            case "horse":
                availableMoves = this.findMovesForHorse(piece);
                break;
            case "bishop":
                availableMoves = this.findMovesForBishop(piece);
                break;
            case "tower":
                availableMoves = this.findMovesForTower(piece);
                break;
            case "queen":
                availableMoves = this.findMovesForQueen(piece);
                break;
            case "king":
                availableMoves = this.findMovesForKing(piece);
                break;
            default:
                window.alert("How the heck?!");
                break;
        }
       

        if(withAdditionalChecks)
        {
            availableMoves = this.forceSavingKing(piece, availableMoves);
        }



        return availableMoves;

    }


}