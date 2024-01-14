import { rook, knight, bishop, queen, king, pawn } from './piecesImages.js'; // Replace 'Pieces.js' with the correct file path.
import Events from './Events.js';

const gameBoard = document.querySelector("#gameboard");
const width = 8;
let eventHandler = new Events(width);

const startPieces = [
    rook , knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn, 
    '', '', '', '', '', '', '', '', 
    '', '', '', '', '', '', '', '', 
    '', '', '', '', '', '', '', '', 
    '', '', '', '', '', '', '', '', 
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook , knight, bishop, queen, king, bishop, knight, rook
]
function createBoared(){
    startPieces.forEach((startPiece, i) => {
        const square = document.createElement('div');
        square.classList.add('square');
        square.innerHTML = startPiece;
        square.firstChild?.setAttribute('draggable', true);
        square.setAttribute('square-id', (width * width -1) - i);
       // square.setAttribute('square-id', i);
        const row = Math.floor((63-i)/8) + 1;
        if(row % 2 === 0){
            square.classList.add(i % 2 === 0 ? "grey" : "blue");
        }else{ 
            square.classList.add(i % 2 === 0 ? "blue" : "grey");
        }
        if(i <= 15){
            square.firstChild.firstChild.classList.add('black');
        }
        if(i >= 48){
            square.firstChild.firstChild.classList.add('white');
        }
        gameBoard.append(square);
    })
}
createBoared();

const allSquares = document.querySelectorAll(".square");

allSquares.forEach(square => {
    square.addEventListener('dragstart', (e) => eventHandler.dragStart(e));
    square.addEventListener('dragover', (e) => eventHandler.dragOver(e));
    square.addEventListener('drop', (e) => eventHandler.dragDrop(e));
    square.addEventListener('mouseover', (e) => eventHandler.mouse(e, true));
    square.addEventListener('mouseout', (e) => eventHandler.mouse(e, false));
});


