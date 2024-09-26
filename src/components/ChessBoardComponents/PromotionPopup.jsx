import React, { useState } from 'react';

function PromotionPopup(props) {


    if (props.gameState.pawnToPromote !== null) {

        let id = props.gameState.positionToTileID(props.gameState.pawnToPromote.position);
        let tileID = `Tile${id}`;

        let elementPos = document.getElementById(tileID).getBoundingClientRect();
        let chessBoardPos = document.getElementById("ChessBoard").getBoundingClientRect();
        let xPos = elementPos.left - chessBoardPos.left + window.scrollX;
        let yPos = elementPos.top - chessBoardPos.top + window.scrollY;

        return (
            <div className="PromotionPopup" style={{
                left: `${xPos}px`,
                top: `${yPos}px`,
            }}>
                <div className="Piece" onClick={() => { props.gameState.promotePiece("queen"); props.refreshBoard()} }>
                    <img src="public/images/chessPieces/queen.png" alt="Queen" />
                </div>

                <div className="Piece" onClick={() => { props.gameState.promotePiece("tower"); props.refreshBoard()} }>
                    <img src="public/images/chessPieces/tower.png" alt="Tower" />
                </div>

                <div className="Piece" onClick={() => { props.gameState.promotePiece("bishop");props.refreshBoard()} }>
                    <img src="public/images/chessPieces/bishop.png" alt="Bishop" />
                </div>

                <div className="Piece" onClick={() => { props.gameState.promotePiece("horse"); props.refreshBoard()} }>
                    <img src="public/images/chessPieces/horse.png" alt="Horse" />
                </div>
            </div>
        );
    } else {
        return <></>;
    }
}

export default PromotionPopup;
