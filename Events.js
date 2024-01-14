import Pieces from './pieces.js';
import HighlightPath from './HighlightPath.js';

export default class Events{

    constructor(width) {
        this.MyPath = new HighlightPath(width);
        this.myPieces = new Pieces(width);

        this.width = width;

        this.playerGo = 'white';
        this.playerDisplay = document.querySelector("#player");
        this.playerDisplay.textContent = this.playerGo;

        this.infoDisplay = document.querySelector("#info-display");

        this.isReversed = false;
        this.isPlayerWin = false;

        this.draggedElements = [];
    }
    getInfoOfpiese(event){
        const square = event.target.parentNode;
        const pieceElement = event.target;
        const pieceSVG = square.firstChild.querySelector('.piece svg');
        const squareId = Number(square.getAttribute('square-id'));
        const pieceName = pieceElement.getAttribute('id');
        const pieceColor = pieceSVG.getAttribute('class');

        return [pieceElement, squareId, pieceName, pieceColor];
    }
    mouse(e, is_it_highlighted){
       const [pieceElement, squareId, pieceName, pieceColor] = this.getInfoOfpiese(e);
        if(!this.isPlayerWin){
            if(pieceElement && pieceColor == this.playerGo){
                this.highlightSquare(squareId, pieceColor, pieceName, is_it_highlighted);
            }
        }
    }
    highlightSquare(squareId, colorOfMyPiece, pieceName, Highlight){
        const [startRow, startCol] = this.getRowColFromSquareId(squareId);
        this.MyPath.highlightPathOfpieces(pieceName, [startRow, startCol], colorOfMyPiece , Highlight);
    }
    getRowColFromSquareId(squareId) {
        const row = Math.floor(squareId / this.width);
        const col = squareId % this.width;
        return [ row, col ];
    }
    dragStart(e){
        this.draggedElements = this.getInfoOfpiese(e);
    }
    dragOver(e){
        e.preventDefault();
    }
    dragDrop(e){
        e.stopPropagation();
        const [draggedPiece, squareId, pieceName, pieceColor] = this.draggedElements;
        const opponentGo = this.playerGo === 'black' ? 'white' : 'black';
        const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo);
        const targetId = Number(e.target.getAttribute('square-id')) || Number(e.target.parentNode.getAttribute('square-id'));
        if(pieceColor === this.playerGo){
            this.highlightSquare(squareId, pieceColor, pieceName, false);
            if(this.checkIfValid(squareId, targetId, pieceName)){
                e.target.append(draggedPiece);
                this.changePlayer();
                if(takenByOpponent){
                    e.target.parentNode.append(draggedPiece);
                    e.target.remove();
                    if(this.checkForWin()){
                        this.isPlayerWin = true;
                        return;
                    }
                }
                return;
            }
            if(!takenByOpponent && !this.checkIfValid(squareId, targetId, pieceName)){
                this.infoDisplay.textContent = "you cannot go here!";
                setTimeout(()=> this.infoDisplay.textContent = "", 2000);
                return;
            }
        }else{
            this.infoDisplay.textContent = "you cannot play now, wait please!";
            setTimeout(()=> this.infoDisplay.textContent = "", 2000);
            return;
        }
    
    }
    checkIfValid(startId, targetId, piece){
        switch (piece) {
            case 'pawn':
                return this.myPieces.isValidPawnMove(startId, targetId);
            case 'knight':
                return this.myPieces.isValidKnightMove(startId, targetId);
            case 'bishop':
                return this.myPieces.isValidBishopMove(startId, targetId);
            case 'rook':
                return this.myPieces.isValidRookMove(startId, targetId);
            case 'queen':
                return this.myPieces.isValidQueenMove(startId, targetId);
            case 'king':
                return this.myPieces.isValidKingMove(startId, targetId);
        }
    }
    checkForWin(){
        const kings = Array.from(document.querySelectorAll('#king'));
        
        if(!kings.some(king => king.firstChild.classList.contains('white'))){
            this.infoDisplay.innerHTML = "Black player wins!";
            const allSquares = document.querySelectorAll('.square');
            allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false));
        }
        if(!kings.some(king => king.firstChild.classList.contains('black'))){
            this.infoDisplay.innerHTML = "White player wins!";
            const allSquares = document.querySelectorAll('.square');
            allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false));
        }
    }
    changePlayer(){
        this.reverseIds();
        //reverseBoardGame();
        this.isReversed = !this.isReversed;
        if(this.playerGo === "white"){
            this.playerGo = "black";
            this.playerDisplay.textContent = this.playerGo;
        }else{
            this.playerGo = "white";
            this.playerDisplay.textContent = this.playerGo;
        }
    }
    reverseBoardGame() {
        const gameBoard = document.querySelector('#gameboard');
        const rotation = this.isReversed ? '0deg' : '180deg';
        gameBoard.style.transform = `rotate(${rotation})`;
    
        const pieces = document.querySelectorAll('.piece');
        pieces.forEach((piece) => {
            piece.style.transform = `rotate(${rotation})`;
        });
    }
    reverseIds(){
        const allSquares = document.querySelectorAll(".square");
        allSquares.forEach((square, i)=>{
            if(square.getAttribute('square-id') == i){
                square.setAttribute('square-id', (this.width * this.width -1) - i);
            }else{
                square.setAttribute('square-id', i);
            }
        })
    }
}

