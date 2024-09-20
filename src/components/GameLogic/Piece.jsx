
export class Piece
{
    constructor(_color, _type, _initialPosition)
    {
        this.type = _type;
        this.color = _color;
        this.position = _initialPosition;
        this.initialPosition = _initialPosition;

        this.id = this.type + this.color + this.initialPosition;
    };

   


}