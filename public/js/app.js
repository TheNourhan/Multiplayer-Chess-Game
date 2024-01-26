import { rook, knight, bishop, queen, king, pawn } from './piecesImages.js';
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

const startTime = new Date().getTime();
function updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;
    const seconds = Math.floor(elapsedTime / 1000) % 60;
    const minutes = Math.floor(elapsedTime / (1000 * 60)) % 60;
    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    document.getElementById('timer').innerText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
const timerInterval = setInterval(updateTimer, 1000);
updateTimer();


const allSquares = document.querySelectorAll(".square");
let isReversed = false;
function reverseBoardGame() {
    const gameBoard = document.querySelector('#gameboard');
    const rotation = isReversed ? '0deg' : '180deg';
    gameBoard.style.transform = `translate(-50%, -50%) rotate(${rotation})`;

    let pieces = document.querySelectorAll('.piece');
    //console.log(pieces)
    pieces.forEach((piece) => {
        piece.style.transform = `rotate(${rotation})`;
    });

    // Toggle the isReversed variable if needed
     //isReversed = !isReversed;
}

const colorBoard = gameBoard.getAttribute('class');
if(colorBoard === 'black'){
    reverseBoardGame();
    eventHandler.reverseIds();
}

const socket = io();

allSquares.forEach(square => {
    square.addEventListener('dragstart', (e) => eventHandler.dragStart(e));
    square.addEventListener('dragover', (e) => eventHandler.dragOver(e));
    square.addEventListener('drop', (e) => {
        const [oldStartId, oldTargetId, pieceSVG] = eventHandler.dragDrop(e);
        socket.emit('player', { color: colorBoard, startId: oldStartId, targetId: oldTargetId });
        socket.emit('move', { color: colorBoard, startId: oldStartId, targetId: oldTargetId });
        if(eventHandler.isPlayerWin){
            socket.emit('win', { color: colorBoard, startId: oldStartId, targetId: oldTargetId });
        }
    });
    square.addEventListener('mouseover', (e) => eventHandler.mouse(e, true));
    square.addEventListener('mouseout', (e) => eventHandler.mouse(e, false));
});

socket.on('new-move', (data) => {
    console.log('New move received:', data);
    eventHandler.updatePiecePosition(data.startId, data.targetId);
});
socket.on('change-player', (data) => {
    console.log('New player received:', data);
    eventHandler.changePlayer();
});
socket.on('check-for-win', (data) => {
    console.log('New win received:', data);
    eventHandler.checkForWin();
});

