export class Vector2
{
    constructor(_x, _y)
    {
        this.x = _x;
        this.y = _y;
    }

    isEqualTo(vec)
    {
        return vec.x == this.x && vec.y == this.y;
    }

}