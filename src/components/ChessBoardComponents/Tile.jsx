
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

    let id = props.id;

    let moveIndicator = <div></div>
    if(props.possibleMove)
    {
      moveIndicator = <div className="moveIndicator"> <div>  </div></div>
    }

    return (
        <div onClick={() => props.selectTile(id)} id={id} className={props.color+"Tile tile"}>
            
        {img}
       {moveIndicator}
        </div>
      
    )
  }
  
  export default Tile
  