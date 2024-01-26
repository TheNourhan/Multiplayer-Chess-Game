import Pieces from './pieces.js';
import HighlightPath from './HighlightPath.js';

export default class Events{

    constructor(width) {
        this.MyPath = new HighlightPath(width);
        this.myPieces = new Pieces(width);

        this.width = width;
        this.colorBoard = document.querySelector("#gameboard").getAttribute('class');
        
        this.playerGo = 'white';
        this.playerDisplay = document.querySelector("#player");
        this.playerDisplay.textContent = this.playerGo;

        this.infoDisplay = document.querySelector("#info-display");

        this.isReversed = false;
        this.isPlayerWin = false;

        this.draggedElements = [];
    }
    getInfoOfpiese(event) {
        const square = event.target?.parentNode;
        if (!square) {
            console.error('Invalid event target:', event.target);
            return [null, null, null, null];
        }
    
        const pieceElement = event.target;
        const pieceSVGContainer = square.firstChild;
        const pieceSVG = pieceSVGContainer?.querySelector('.piece svg');
        const squareId = Number(square.getAttribute('square-id'));
        const pieceName = pieceElement.getAttribute('id');
        const pieceColor = pieceSVG?.getAttribute('class');
        
        if (pieceColor === null || pieceSVGContainer === null) {
            console.error('Invalid piece color or SVG container:', pieceColor, pieceSVGContainer);
            return [null, null, null, null];
        }
    
        return [pieceElement, squareId, pieceName, pieceColor];
    } 
    mouse(e, is_it_highlighted){
       const [pieceElement, squareId, pieceName, pieceColor] = this.getInfoOfpiese(e);
        if(!this.isPlayerWin){
            if(pieceElement && pieceColor == this.playerGo && this.colorBoard === this.playerGo){
                this.highlightSquare(squareId, pieceColor, pieceName, is_it_highlighted);
            }
        }
    }
    highlightSquare(squareId, colorOfMyPiece, pieceName, Highlight){
        const [startRow, startCol] = this.getRowColFromSquareId(squareId);
        this.MyPath.highlightPathOfpieces(pieceName, [startRow, startCol], colorOfMyPiece , Highlight);
    }
    getRowColFromSquareId(squareId){
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
        
        if(pieceColor === this.playerGo && this.colorBoard === this.playerGo){
            this.highlightSquare(squareId, pieceColor, pieceName, false);
            if(this.checkIfValid(squareId, targetId, pieceName)){
                e.target.append(draggedPiece);
                //this.changePlayer()
                let oldTargetId = draggedPiece.parentNode.getAttribute('square-id');
                if(takenByOpponent){
                    e.target.parentNode.append(draggedPiece);
                  
                    this.takenPieces(e.target.firstChild, this.colorBoard)
                    e.target.remove();
                    oldTargetId = draggedPiece.parentNode.getAttribute('square-id');
                    
                    if(this.checkForWin()){
                        
                        return [squareId, oldTargetId];
                    }
                    return [squareId, oldTargetId];
                }               
                return [squareId, oldTargetId, e.target.firstChild];
            }
            if(!takenByOpponent && !this.checkIfValid(squareId, targetId, pieceName)){
                this.infoDisplay.textContent = "you cannot go here!";
                setTimeout(()=> this.infoDisplay.textContent = "", 3000);
                return;
            }
        }else{
            this.infoDisplay.textContent = "you cannot play now, wait please!";
            setTimeout(()=> this.infoDisplay.textContent = "", 2000);
            return;
        }
    }
    takenPieces(pieceSVG, colorBoard) {
        const takenPieceBoard = document.querySelector(`.taken-pieces-board.${colorBoard}`);
        takenPieceBoard.style.backgroundColor = '#f0f0f0';
        takenPieceBoard.style.border = '1px solid #ccc';
        const piece = document.createElement('div');
        piece.classList.add('taken-piece');
        piece.append(pieceSVG);
        takenPieceBoard.appendChild(piece);
        if(takenPieceBoard.childElementCount <= 4){
            takenPieceBoard.style.width = `${takenPieceBoard.childElementCount * 40}px`;
        }
        
    }
    updatePiecePosition(oldStartId, oldTargetId){
        //const [oldStartId, oldTargetId] = dragDrop();
        const newStart = document.querySelector(`[square-id="${this.convertPieceId(oldStartId)}"]`);
        const newTarget = document.querySelector(`[square-id="${this.convertPieceId(oldTargetId)}"]`);
        if (newTarget) {
            // Access properties and update the DOM
            const piece = newStart.firstChild;
            newStart.innerHTML = '';
            newTarget.innerHTML = '';
            newTarget.appendChild(piece);
        } else {
            console.error('Target square not found:', newTarget);
        }
        /*
        const piece = newStart.firstChild;
        //console.log(newStart.firstChild)
        newStart.innerHTML = '';
        if(newTarget.firstChild){
            newTarget.innerHTML = '';
        }
        console.log(newTarget)
        newTarget.innerHTML = '';
        newTarget.appendChild(piece);
        */
    }
    convertPieceId(localPieceId){
        return this.width * this.width - 1 - Number(localPieceId);
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
            this.isPlayerWin = true;
            this.infoDisplay.innerHTML = "Black player wins!";
            const allSquares = document.querySelectorAll('.square');
            allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false));
            return true;
        }
        if(!kings.some(king => king.firstChild.classList.contains('black'))){
            this.isPlayerWin = true;
            this.infoDisplay.innerHTML = "White player wins!";
            const allSquares = document.querySelectorAll('.square');
            allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false));
            return true;
        }
        return false;
    }  
    changePlayer(){
        if(this.playerGo === "white"){
            this.playerGo = "black";
            this.playerDisplay.textContent = this.playerGo;
        }else{
            this.playerGo = "white";
            this.playerDisplay.textContent = this.playerGo;
        }      
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

