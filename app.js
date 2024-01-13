const gameBoard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector("#player");
const infoDisplay = document.querySelector("#info-display");
const width = 8;
const myPieces = new Pieces(width);
const MyPath = new HighlightPath(width);
const board = Array(64).fill(null);
let playerGo = 'white';
playerDisplay.textContent = playerGo;
let startPostitionId;
let draggedElement;
let isReversed = false;

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
        board[i] = startPiece ? { piece: startPiece, color: playerGo } : null;
    })
}
createBoared();
function updateBoard(startId, targetId) {
    // Update the board array based on the moved piece
    board[targetId] = board[startId];
    board[startId] = null;
}
const allSquares = document.querySelectorAll(".square");

allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart);
    square.addEventListener('dragover', dragOver);
    square.addEventListener('drop', dragDrop);
    square.addEventListener('mouseover', mouseOver);
    square.addEventListener('mouseout', mouseOut);
    /*
    square.addEventListener('click', (e)=>{ 
        draggedElement = e.target;
        const firstChild = square.firstChild;

        if (firstChild) { // Check if firstChild is not null
            const pieceElement = firstChild.querySelector('.piece svg');
            const pieceName = firstChild.getAttribute('id');

            if (pieceElement) {
                let colorOfMyPiece = pieceElement.getAttribute('class');
                const correctPlayer = draggedElement.firstChild.classList.contains(playerGo);

                if (correctPlayer) {
                   // console.log(`Mouse out: ${pieceName} - ${colorOfMyPiece}`);
                    clickElement(e, colorOfMyPiece, pieceName, false);
                }
            }
        }
    });*/
})
function mouseOver(e){
    draggedElement = e.target;
    const first_child = draggedElement.parentNode.firstChild;
    if(first_child.firstChild) { // Check if firstChild is not null
        const pieceElement = first_child.querySelector('.piece svg');
        const pieceName = first_child.getAttribute('id');
        if (pieceElement && draggedElement.firstChild) {
            let colorOfMyPiece = pieceElement.getAttribute('class');
            const correctPlayer = draggedElement.firstChild.classList.contains(playerGo);
            if (correctPlayer) {
                clickElement(e.target.parentNode, colorOfMyPiece, pieceName, true);
            }
        }
    }
}
function mouseOut(e){
    draggedElement = e.target;
    const firstChild = draggedElement.parentNode.firstChild;
    if (firstChild) { // Check if firstChild is not null
        const pieceElement = firstChild.querySelector('.piece svg');
        const pieceName = firstChild.getAttribute('id');
        if (pieceElement && draggedElement.firstChild) {
            let colorOfMyPiece = pieceElement.getAttribute('class');
            const correctPlayer = draggedElement.firstChild.classList.contains(playerGo);
            if (correctPlayer){
                clickElement(e.target.parentNode, colorOfMyPiece, pieceName, false);
            }
        }
    }
}
function clickElement(event, colorOfMyPiece, pieceName, Highlight){
    const startId = Number(event.getAttribute('square-id'));
    const [startRow, startCol] = getRowColFromSquareId(startId);
    MyPath.highlightPathOfpieces(pieceName, [startRow, startCol], colorOfMyPiece , Highlight);
}
function getRowColFromSquareId(squareId) {
    const row = Math.floor(squareId / width);
    const col = squareId % width;
    return [ row, col ];
}
function dragStart(e){
    startPostitionId = e.target.parentNode.getAttribute('square-id');
    draggedElement = e.target;
}
function dragOver(e){
    e.preventDefault();
}
function blockOne(e){
    allSquares.forEach((square, index)=> {
        //console.log(e)
        //console.log(e.target.parentNode)
        //draggedElement = e.target;
        const firstChild = square.firstChild;
        

        if (firstChild) { // Check if firstChild is not null
            const pieceElement = firstChild.querySelector('.piece svg');
            const pieceName = firstChild.getAttribute('id');

            if (pieceElement) {
                let colorOfMyPiece = pieceElement.getAttribute('class');
                //console.log(draggedElement.parentNode)
                const p = draggedElement.parentNode[1];
                const correctPlayer = draggedElement.firstChild.classList.contains(playerGo);
                //console.log(e)
                if (correctPlayer){
                   // console.log(`Mouse out: ${pieceName} - ${colorOfMyPiece}`);
                    clickElement(e, colorOfMyPiece, pieceName, false);
                }
            }
        }
       
    });
    console.log('block one')
    return true;
}
function dragDrop(e){
    e.stopPropagation();
    //console.log('drag', e.target)
    //console.log(e.target.firstChild)
    // block one
    const correctPlayer = draggedElement.firstChild.classList.contains(playerGo);//{draggedElement.firstChild} is picture (svg) {bolean type}
    //console.log('draggedElement', draggedElement.getAttribute('id'))
    const pieceName =  draggedElement.getAttribute('id');
    const colorOfMyPiece = draggedElement.firstChild.classList[0];
    //const taken = e.target.classList.contains('peice');
    //console.log('taken',taken)
    const opponentGo = playerGo === 'black' ? 'white' : 'black';
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo);//picture of piece eat it

    const targetId = Number(e.target.getAttribute('square-id')) || Number(e.target.parentNode.getAttribute('square-id'));
    const startId = Number(startPostitionId);
    const piece = draggedElement.id;
    //console.log(piece)
    //console.log(e.target)
    //console.log(e.target.parentNode)
    if(correctPlayer){
        clickElement(draggedElement.parentNode, colorOfMyPiece, pieceName, false);
        //console.log('player',correctPlayer)
        if(checkIfValid(startId, targetId, piece)){
            //e.target.remove();
            e.target.append(draggedElement);
            //console.log(e.target)
            //console.log(e.target.parentNode)
            checkForWin();
            changePlayer();
            updateBoard(startId, targetId);
            if(takenByOpponent){
                //console.log(e.target)
                e.target.parentNode.append(draggedElement);
                e.target.remove();
                //console.log(e.target)
                //console.log(e.target.parentNode)
            }
            return;
        } 
        if(!takenByOpponent && !checkIfValid(startId, targetId, piece)){
            /*
            let infoDisplay = document.createElement('p');
            infoDisplay.id = 'info-display';
            infoDisplay.textContent = "you cannot go here!";
            */
            infoDisplay.textContent = "you cannot go here!";
            setTimeout(()=> infoDisplay.textContent = "", 2000);
            return;
        }
    }else{
        infoDisplay.textContent = "you cannot play now, wait please!";
        setTimeout(()=> infoDisplay.textContent = "", 2000);
        return;
    }

}
function checkIfValid(startId, targetId, piece){
    switch (piece) {
        case 'pawn':
            return myPieces.isValidPawnMove(startId, targetId);
        case 'knight':
            return myPieces.isValidKnightMove(startId, targetId);
        case 'bishop':
            return myPieces.isValidBishopMove(startId, targetId);
        case 'rook':
            return myPieces.isValidRookMove(startId, targetId);
        case 'queen':
            return myPieces.isValidQueenMove(startId, targetId);
        case 'king':
            return myPieces.isValidKingMove(startId, targetId);
        //default:
            //return false; // If the piece is not recognized, consider the move invalid
    }
}
function checkForWin(){
    const kings = Array.from(document.querySelectorAll('#king'));
    //console.log(kings);
    if(!kings.some(king => king.firstChild.classList.contains('white'))){
        infoDisplay.innerHTML = "Black player wins!";
        const allSquares = document.querySelectorAll('.square');
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false));
    }
    if(!kings.some(king => king.firstChild.classList.contains('black'))){
        infoDisplay.innerHTML = "White player wins!";
        const allSquares = document.querySelectorAll('.square');
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false));
    }
}
function changePlayer(){
    reverseIds();
    //reverseBoardGame();
    isReversed = !isReversed;
    if(playerGo === "white"){
        playerGo = "black";
        playerDisplay.textContent = playerGo;
    }else{
        playerGo = "white";
        playerDisplay.textContent = playerGo;
    }
}
function reverseBoardGame() {
    const gameBoard = document.querySelector('#gameboard');
    const rotation = isReversed ? '0deg' : '180deg';
    gameBoard.style.transform = `rotate(${rotation})`;

    const pieces = document.querySelectorAll('.piece');
    pieces.forEach((piece) => {
        piece.style.transform = `rotate(${rotation})`;
    });
}
function reverseIds(){
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square, i)=>{
        if(square.getAttribute('square-id') == i){
            square.setAttribute('square-id', (width * width -1) - i);
        }else{
            square.setAttribute('square-id', i);
        }
    })
}


