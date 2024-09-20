
function Tile(props) {
  // src={process.env.PUBLIC_URL+"/images/chessPieces/"+props.image_name}
    let piece = props.pieceHere;

    let img = <img/>;
    
    if (piece !== null)
    {
        img = <div className={"Piece  "+piece.color}>
                <img src={import.meta.env.BASE_URL+"images/chessPieces/"+ piece.type+".png"}/>
            </div>
    }

    return (
        <div className={props.color+"Tile tile"}>
            
        {img}
       
        </div>
      
    )
  }
  
  export default Tile
  