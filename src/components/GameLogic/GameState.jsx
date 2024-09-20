
import { Piece } from "./Piece";
import { Vector2 } from "./Misc/Vector2";

export class GameState
{
    constructor()
    {
        this.turnOf = "game not started";
        this.pieces = [];
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


}