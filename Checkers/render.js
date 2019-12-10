import Checkers from "./Engine/Checkers.js";

let game = new Checkers(false);
let gs = game.gameState;
let tiles = game.getBoard();
let selectedPiece;

$(document).ready( function () {

    // Initialize board
    for (let i=0; i<8; i++) {
        for (let j=0; j<8; j++) {
            if (i%2 != 0) {
                if (j%2 == 0) {
                    let id = "#"+i.toString()+j.toString();
                    $(id).css("background-color", "#171717");
                    $(id).css("color", "white");
                }
            } else {
                if (j%2 != 0) {
                    let id = "#"+i.toString()+j.toString();
                    $(id).css("background-color", "#171717");
                    $(id).css("color", "white");
                }
            }
        }
    }

    game.showMoves(function(moves) {moves.forEach(element => {
        
        let did = "#"+element.y.toString()+element.x.toString();
        if (element.type == "move") {
            $(did).append('<div id=p'+element.y.toString()+element.x.toString()+' class="piece phantom-move"></div>');
        } else if (element.type == "attack") {
            $(did).append('<div id=p'+element.y.toString()+element.x.toString()+' class="piece phantom-attack"></div>');
        } else if (element.type == "selected") {
            $(did).empty();
            $(did).append('<div id=p'+element.y.toString()+element.x.toString()+' class="piece selected"></div>');
        }
    })});

    game.removeShowMoves(function(moves) {
        for (let i=0; i<8; i++) {
            for (let j=0; j<8; j++) {
                let did = "#"+i.toString()+j.toString();
                let pid = "p"+i.toString()+j.toString();
                let docElt = document.getElementById(pid);
                if (tiles[i][j] == null) {
                    $(did).empty();
                } else {
                    if (docElt != null) {
                        if (docElt.getAttribute('class') != 'piece selected') {
                            if (tiles[i][j].color == 'white') {
                                docElt.setAttribute('class', 'piece red');
                            } else {
                                docElt.setAttribute('class', 'piece black');
                            }
                        }
                    }
                }
            }
        }
    });

    game.onWin(function() {
        gs = game.gameState;
        let winner = gs.winner;
        console.log(winner);
        if (winner == 'white') {
            $('h4.description').replaceWith('<h4 class="won">Red wins! Play again?</h4>');
        } else {
            $('h4.description').replaceWith('<h4 class="won">Black wins! Play again?</h4>');
        }
    });

    $('button').click(function() {
        game.resetBoard();
        gs = game.gameState;
        tiles = game.getBoard();
        refreshBoard();
    });

    refreshBoard();
});

$('.tile').click(function(event) {
    let gs = game.gameState;
    let index = this.id.toString();
    tiles = game.getBoard();
    let i = parseInt(index[0]);
    let j = parseInt(index[1]);
    let pid = "p"+i.toString()+j.toString();
    let pieceDiv;
    
    removeSelected();

    if (!selectedPiece) {
        if (game.isSelectable(j, i)) {
            selectedPiece = true;
        }

        game.processInput(j, i);
    } else {
        if (game.isMove(j, i) > -1) {
            selectedPiece = false;
            game.processInput(j, i);
            refreshBoard();
        } else if (game.isSelectable(j, i)) {
            game.processInput(j, i);
        }
    }

    // // Check to see if a piece has already been selected, to see if this click is move click or a select click
    // if (selectedPiece != null) {
    //     // yes a piece has already been selected
    //     // did we click the already selected piece?
    //     if (j != parseInt(selectedPiece.position.X) || i != parseInt(selectedPiece.position.Y)) {
    //         // no we didn't
    //         console.log('didnt click the same piece');
    //         // did we click on another piece?
    //         if(tiles[i][j] != null) {
    //             // yes we did
    //             console.log('we did click a piece though')
    //             // is that piece selectable?
    //             if (game.isSelectable(j, i)) {
    //                 // yes it is
    //                 let spid = "p"+selectedPiece.position.Y.toString()+selectedPiece.position.X.toString();
    //                 pieceDiv = document.getElementById(spid);
    //                 if (selectedPiece.getColor() == 'white') {
    //                     pieceDiv.setAttribute('class','piece red');
    //                 } else {
    //                     pieceDiv.setAttribute('class','piece black');
    //                 }

    //                 selectedPiece = tiles[i][j];
    //                 pieceDiv = document.getElementById(pid);
    //                 pieceDiv.setAttribute('class', 'piece selected');


    //             } else {
    //                 // no that piece is not selectable
    //                 // let spid = "p"+selectedPiece.position.Y.toString()+selectedPiece.position.X.toString();
    //                 // pieceDiv = document.getElementById(spid);
    //                 // if (selectedPiece.getColor() == 'white') {
    //                 //     pieceDiv.setAttribute('class','piece red');
    //                 // } else {
    //                 //     pieceDiv.setAttribute('class','piece black');
    //                 // }
    //                 // selectedPiece = null;
    //             }
    //             game.processInput(j, i);
    //         } else {
    //             // no we didn't select another piece
    //             // is what you clicked a valid move?
    //             if (game.isMove(j, i) > -1) {
    //                 // yes it is
    //                 game.processInput(j, i);
    //                 refreshBoard();
    //                 selectedPiece = null;
    //             } else {
    //                 // no it's not a valid move
    //                 // console.log('non-valid move clicked');
    //                 // let spid = "p"+selectedPiece.position.Y.toString()+selectedPiece.position.X.toString();
    //                 // pieceDiv = document.getElementById(spid);
    //                 // if (selectedPiece.getColor() == 'white') {
    //                 //     pieceDiv.setAttribute('class','piece red');
    //                 // } else {
    //                 //     pieceDiv.setAttribute('class','piece black');
    //                 // }
                    
    //                 game.processInput(j, i);
    //                 selectedPiece = null;
    //             }
    //         }
    //     }
    // } else {
    //     // no, no piece is currently selected
    //     console.log('selecting piece');
    //     // is what you clicked a piece that has valid moves?
    //     if (tiles[i][j] != null && game.isSelectable(j, i)) {
    //         // yes it is
    //         console.log("this is a valid piece, selected")
    //         selectedPiece = tiles[i][j];
    //         pieceDiv = document.getElementById(pid);
    //         pieceDiv.setAttribute('class', 'piece selected');

    //         game.processInput(j, i);
    //     } else {
    //         console.log(tiles[i][j] != null);
    //         console.log(game.isSelectable(j,i));
    //         // no this is not a piece with valid move
    //         console.log("this is not a valid piece");
    //         game.processInput(j, i);
    //     }
    // }
});

function refreshBoard() {
    tiles = game.getBoard();
    gs = game.gameState;
    for (let i=0; i<tiles.length; i++) {
        for (let j=0; j<tiles.length; j++) {
            let did = "#"+i.toString()+j.toString();
            let pid = "p"+i.toString()+j.toString();
            $(did).empty();

            if (tiles[i][j] != null) {
                if(tiles[i][j].toString().includes("W")) {
                    $(did).append('<div id="'+pid+'" class="piece red"></div>');
                } else if(tiles[i][j].toString().includes("B")) {
                    $(did).append('<div id="'+pid+'" class="piece black"></div>');
                } else {
                    $(did).empty();
                }
            }
            
            // $('#'+pid.toString()).css('height','80%');
            // $('#'+pid.toString()).css('width','80%');
        }
    }

    // $('.piece').css('width', '80%');
    // $('.piece').css('height', '80%');

    if (gs.turn == "white") {
        $("h4.description").replaceWith("<h4 class='description'>Red's turn!<h4>");
        $('h4.won').replaceWith("<h4 class='description'>Red's turn!<h4>");
    } else {
        $("h4.description").replaceWith("<h4 class='description'>Black's turn!<h4>");
        $('h4.won').replaceWith("<h4 class='description'>Black's turn!<h4>");
    }

    $("#score").replaceWith('<h2 id="score">R: '+gs.whitePieces+' | B: '+gs.blackPieces+'</h3>');

    // for (let i=0; i<game.selectAblePiece.length;i++) {
    //     let pid = '#p'+game.selectAblePiece[i].Y+game.selectAblePiece[i].X;
    //     $(pid).css('background-color','yellow');
    //     $(pid).css('box-shadow', '0 .5vh #b09f1c');
    // }
}

function removeSelected() {
    for (let i=0; i<8; i++) {
        for (let j=0; j<8; j++) {
            
            let pid = 'p'+i.toString()+j.toString();
            let piece = document.getElementById(pid);
            if (piece != null) {
                console.log(pid+piece.getAttribute('class'));
            }
            
            if (piece != null && piece.getAttribute('class') == 'piece selected') {
                console.log('made it')
                if (tiles[i][j].color == 'white') {
                    piece.setAttribute('class', 'piece red');
                } else {
                    piece.setAttribute('class', 'piece black');
                }
            }
        }
    }
}