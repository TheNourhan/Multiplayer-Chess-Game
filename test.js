const gameBoard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector("#player");
const infoDisplay = document.querySelector("#info-display");
const width = 8;
const myPieces = new Pieces(width);
let playerGo = 'black';
playerDisplay.textContent = 'black';
const board = Array(64).fill(null);

const startPieces = [
    'rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook',
    'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn',
    'rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'
];

function createBoard() {
    startPieces.forEach((startPiece, i) => {
        const square = document.createElement('div');
        square.classList.add('square');
        square.innerHTML = startPiece ? `<div class="piece ${startPiece} ${playerGo}"></div>` : '';
        square.setAttribute('draggable', startPiece ? true : false);
        square.setAttribute('square-id', i);
        const row = Math.floor((63 - i) / 8) + 1;
        if (row % 2 === 0) {
            square.classList.add(i % 2 === 0 ? "beige" : "brown");
        } else {
            square.classList.add(i % 2 === 0 ? "brown" : "beige");
        }
        if (i <= 15) {
            square.firstChild.classList.add('black');
        }
        if (i >= 48) {
            square.firstChild.classList.add('white');
        }
        gameBoard.append(square);
        board[i] = startPiece ? { piece: startPiece, color: playerGo } : null;
    });
}

createBoard();

const allSquares = document.querySelectorAll(".square");

allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart);
    square.addEventListener('dragover', dragOver);
    square.addEventListener('drop', dragDrop);
});

let startPostitionId;
let draggedElement;

function dragStart(e) {
    startPostitionId = e.target.parentNode.getAttribute('square-id');
    draggedElement = e.target;
}

function dragOver(e) {
    e.preventDefault();
}

function dragDrop(e) {
    e.stopPropagation();

    const targetId = Number(e.target.getAttribute('square-id')) || Number(e.target.parentNode.getAttribute('square-id'));
    const startId = Number(startPostitionId);
    const piece = draggedElement.classList.contains('piece') ? draggedElement.classList[1] : null;

    if (checkIfValid(startId, targetId, piece)) {
        e.target.append(draggedElement);
        updateBoard(startId, targetId);
        checkForWin();
        changePlayer();
    }
}

function checkIfValid(startId, targetId, piece) {
    // Implement the logic for checking the validity of the move
    // You can use the methods from the Pieces class or custom logic
    // based on your specific rules for each piece
    // For now, return true to allow any move
    return true;
}

function updateBoard(startId, targetId) {
    // Update the board array based on the moved piece
    board[targetId] = board[startId];
    board[startId] = null;
}

function changePlayer() {
    playerGo = playerGo === 'white' ? 'black' : 'white';
    playerDisplay.textContent = playerGo;
}

function checkForWin() {
    // Implement the logic to check for a win condition
    // You can check the current state of the board array
    // and determine if a player has won the game
    // For now, simply log a message
    console.log('Checking for win...');
}















class highlight{
    highlightPath(piece, currentPosition) {
        // Clear previous highlights
        this.clearHighlights();
    
        if (piece === 'knight') {
            const possibleMoves = this.calculateKnightMoves(currentPosition);
    
            // Highlight possible moves
            this.highlightSquares(possibleMoves);
            
            return possibleMoves;
        } else if (piece === 'bishop') {
            const possibleMoves = this.calculateBishopMoves(currentPosition);
    
            // Highlight possible moves
            this.highlightSquares(possibleMoves);
            
            return possibleMoves;
        }
        // Add similar blocks for other pieces
    
        // If the piece is not recognized, return an empty array
        return [];
    }
    
    calculateKnightMoves(currentPosition) {
        // Calculate knight moves
        const moves = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];
    
        return this.filterValidMoves(currentPosition, moves);
    }
    
    calculateBishopMoves(currentPosition) {
        // Calculate bishop moves
        const moves = [
            [-1, -1], [-1, 1], [1, -1], [1, 1]
        ];
    
        return this.filterValidMoves(currentPosition, moves);
    }
    
    filterValidMoves(currentPosition, moves) {
        const validMoves = [];
    
        for (const move of moves) {
            const newRow = Math.floor(currentPosition / width) + move[0];
            const newCol = currentPosition % width + move[1];
    
            const newSquareId = newRow * width + newCol;
    
            if (newRow >= 0 && newRow < width && newCol >= 0 && newCol < width) {
                validMoves.push(newSquareId);
            }
        }
    
        return validMoves;
    }
    
    highlightSquares(squares) {
        const allSquares = document.querySelectorAll(".square");
    
        squares.forEach(squareId => {
            const squareElement = document.querySelector(`[square-id="${squareId}"]`);
            if (squareElement) {
                squareElement.style.backgroundColor = 'blue';
            }
        });
    }
    
    clearHighlights() {
        const allSquares = document.querySelectorAll(".square");
    
        allSquares.forEach(square => {
            square.style.backgroundColor = ''; // Reset background color
        });
    }



    highlightPath(piece, currentPosition) {
        if (piece === 'knight') {
            const possibleMoves = [];
    
            // Knight moves in an L-shape pattern
            const moves = [
                [-2, -1], [-2, 1], [-1, -2], [-1, 2],
                [1, -2], [1, 2], [2, -1], [2, 1]
            ];
            for (const move of moves) {
                let newPosition = [currentPosition[0] + move[0], currentPosition[1] + move[1]];
                // Check if the new position is on the chessboard (assuming an 8x8 board)
                if (newPosition[0] >= 0 && newPosition[0] < 8 &&
                    newPosition[1] >= 0 && newPosition[1] < 8) {
                    possibleMoves.push(newPosition);
                }
            }
            console.log(possibleMoves)
           const allSquares = document.querySelectorAll(".square");
           let colorOfPiece;
           
            
            allSquares.forEach((square, i) => {
                // Convert square ID to number before comparing
                
                
                square.addEventListener('click', () => {
                    let color;
                    colorOfPiece = square.querySelector('.piece svg').getAttribute('class');
                    /*if(square.getAttribute('square-id') === this.getSquareId([possibleMoves[i]])){
                         color = square.firstChild.firstChild.getAttribute('class')
                    }*/
                    console.log(colorOfPiece)
                    if (possibleMoves.some(move => this.getSquareId(move[0], move[1]) === squareId)) {
                        allSquares[i].style.backgroundColor = 'blue';
                    }
               
                })
            });
            return possibleMoves;
        } else {
            // Handle other pieces here
            return [];
        }
    }
    getSquareId(row, col) {
        return row * 8 + col;
    }
    
}





