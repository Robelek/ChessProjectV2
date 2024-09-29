export class MinMaxEval
{
   evaulate(gameState)
   {
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