export class MinMaxEval
{
   evaulate(gameState)
   {
    if(gameState.turnOf == "black won")
    {
        return -Infinity;
    }
    else if(gameState.turnOf == "white won")
    {
        return Infinity;
    }

    //simple evaluation for now
    let whitePieces = 0;
    let blackPieces = 0;

    for(let piece of gameState.pieces)
    {
        if(piece.color == "white")
        {
            whitePieces++;
        }
        else
        {
            blackPieces++;
        }
    }
    return whitePieces - blackPieces;
   }

}