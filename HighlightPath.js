export default class HighlightPath{
    constructor(width){
        this.width = width;
    }
    getSquareId(row, col) {
        return row * 8 + col;
    }
    highlight(squareId, is_it_highlighted){
        let parentDiv = document.querySelector(`[square-id="${squareId}"]`);
        if(is_it_highlighted){
           // parentDiv.style.backgroundColor = "rgb(139, 91, 172)"; // hsl(186 100% 69%) hsl(166 100% 69%)
            parentDiv.style.backgroundColor = "hsl(186 100% 69%)";
            parentDiv.style.boxShadow = "0 0 2em 0.2em hsl(186 100% 69%)";

        }else{
            if(parentDiv.classList.contains('blue')){
                parentDiv.style.backgroundColor = 'rgba(0, 145, 255, 0.728)';
                parentDiv.style.boxShadow = "";
            }else if(parentDiv.classList.contains('grey')){
                parentDiv.style.backgroundColor = 'rgb(188, 188, 188)';
                parentDiv.style.boxShadow = "";
            }
        }
    }
    findPiece(squareId){
        if(squareId => 0 && squareId < 64){
            return document.querySelector(`[square-id="${squareId}"]`).firstChild;
        }else{
            return false;
        }
    }
    highlightPathOfpieces(piece, currentRowCol, colorOfMyPiece, is_it_highlighted){
        switch (piece) {
            case 'pawn':
                return this.highlightPathOfPawn(currentRowCol, colorOfMyPiece, is_it_highlighted);
            case 'knight':
                return this.highlightPathOfKnight(currentRowCol, colorOfMyPiece, is_it_highlighted);
            case 'bishop':
                return this.highlightPathOfBishop(currentRowCol, colorOfMyPiece, is_it_highlighted);
            case 'rook':
                return this.highlightPathOfRook(currentRowCol, colorOfMyPiece, is_it_highlighted);
            case 'queen':
                return this.highlightPathOfQueen(currentRowCol, colorOfMyPiece, is_it_highlighted);
            case 'king':
                return this.highlightPathOfKing(currentRowCol, colorOfMyPiece, is_it_highlighted);      
        }
    }
    highlightPathOfPawn(currentRowCol, colorOfMyPiece, is_it_highlighted){ 
        const squareId = this.getSquareId(currentRowCol[0], currentRowCol[1]);
        const starterRow = [8,9,10,11,12,13,14,15];
        if((starterRow.includes(squareId) && !this.findPiece(squareId + this.width) && !this.findPiece(squareId + this.width * 2))){
            this.highlight(squareId + this.width, is_it_highlighted)
            this.highlight(squareId + this.width * 2, is_it_highlighted)
        }else if(!this.findPiece(squareId + this.width)){
            this.highlight(squareId + this.width, is_it_highlighted)
        }
        
        if(this.findPiece(squareId + this.width - 1) && !this.findPiece(squareId + this.width - 1).firstChild.classList.contains(colorOfMyPiece)){
            this.highlight(squareId + this.width - 1, is_it_highlighted)
        }
        if(this.findPiece(squareId + this.width + 1) && !this.findPiece(squareId + this.width + 1).firstChild.classList.contains(colorOfMyPiece)){
            this.highlight(squareId + this.width + 1, is_it_highlighted)
        }
    }
    highlightPathOfKnight(currentRowCol, colorOfMyPiece, is_it_highlighted){
        const possibleMoves = [];
        const moves = [ [-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1] ];
        for (const move of moves) {
            let newPosition = [currentRowCol[0] + move[0], currentRowCol[1] + move[1]];
            // Check if the new position is on the chessboard
            if(newPosition[0] >= 0 && newPosition[0] < this.width && newPosition[1] >= 0 && newPosition[1] < this.width) {
                possibleMoves.push(newPosition);
            }
        }
        const allSquares = document.querySelectorAll(".square");
        allSquares.forEach((square) => {
            const squareId = parseInt(square.getAttribute('square-id'), 10);
            if (possibleMoves.some(move => this.getSquareId(move[0], move[1]) === squareId)) {
                const pieceElement = square.querySelector('.piece svg');
                if (!pieceElement || pieceElement && pieceElement.getAttribute('class') != colorOfMyPiece){
                    this.highlight(squareId, is_it_highlighted)
                }
            }         
        });
    }
    pathOfKing(squareId, colorOfMyPiece, is_it_highlighted){
        if(document.querySelector(`[square-id="${squareId}"]`)){
            if(!this.findPiece(squareId) ||  (this.findPiece(squareId) && !(this.findPiece(squareId).firstChild.classList.contains(colorOfMyPiece)))){
                this.highlight(squareId, is_it_highlighted);
            }
        }
    }
    highlightPathOfKing(currentRowCol, colorOfMyPiece, is_it_highlighted){
        const squareId = this.getSquareId(currentRowCol[0], currentRowCol[1]);
        this.pathOfKing(squareId + this.width, colorOfMyPiece, is_it_highlighted);
        this.pathOfKing(squareId - this.width, colorOfMyPiece, is_it_highlighted);
        this.pathOfKing(squareId + this.width + 1, colorOfMyPiece, is_it_highlighted);
        this.pathOfKing(squareId + this.width - 1, colorOfMyPiece, is_it_highlighted);
        this.pathOfKing(squareId - this.width + 1, colorOfMyPiece, is_it_highlighted);
        this.pathOfKing(squareId - this.width - 1, colorOfMyPiece, is_it_highlighted);
        this.pathOfKing(squareId + 1, colorOfMyPiece, is_it_highlighted);
        this.pathOfKing(squareId - 1, colorOfMyPiece, is_it_highlighted);
    }
    highlightPathOfRook(currentRowCol, colorOfMyPiece, is_it_highlighted){
        for (let row = currentRowCol[0] + 1; row < this.width; row++) { // same row (front)
            const findPiece = this.findPiece(this.getSquareId(row, currentRowCol[1]));
            if((findPiece && !findPiece.firstChild.classList.contains(colorOfMyPiece))){
                this.highlight(this.getSquareId(row, currentRowCol[1]), is_it_highlighted);
                break;
            }
            if(!findPiece){
                this.highlight(this.getSquareId(row, currentRowCol[1]), is_it_highlighted);
            }else{
                break;
            }
        }
        for (let row = currentRowCol[0] - 1; row >= 0; row--) { // same row (behind)
            const findPiece = this.findPiece(this.getSquareId(row, currentRowCol[1]));
            if((findPiece && !findPiece.firstChild.classList.contains(colorOfMyPiece))){
                this.highlight(this.getSquareId(row, currentRowCol[1]), is_it_highlighted);
                break;
            }
            if(!findPiece){
                this.highlight(this.getSquareId(row, currentRowCol[1]), is_it_highlighted);
            }else{
                break;
            }
        }
        for (let col = currentRowCol[1] - 1; col >= 0; col--) { // same column (left)
            const findPiece = this.findPiece(this.getSquareId(currentRowCol[0], col));
            if((findPiece && !findPiece.firstChild.classList.contains(colorOfMyPiece))){
                this.highlight(this.getSquareId(currentRowCol[0], col), is_it_highlighted);
                break;
            }
            if(!findPiece){
                this.highlight(this.getSquareId(currentRowCol[0], col), is_it_highlighted);
            }else{
                break;
            }
        }
        for (let col = currentRowCol[1] + 1; col < this.width; col++) { // same column (right)
            const findPiece = this.findPiece(this.getSquareId(currentRowCol[0], col));
            if((findPiece && !findPiece.firstChild.classList.contains(colorOfMyPiece))){
                this.highlight(this.getSquareId(currentRowCol[0], col), is_it_highlighted);
                break;
            }
            if(!findPiece){
                this.highlight(this.getSquareId(currentRowCol[0], col), is_it_highlighted);
            }else{
                break;
            }
        } 
    }
    highlightPathOfBishop(currentRowCol, colorOfMyPiece, is_it_highlighted){      
        // Up Rghit
        for (let row = currentRowCol[0] + 1 , col = currentRowCol[1] + 1; row < this.width && col < this.width ; row++, col++){
            const findPiece = this.findPiece(this.getSquareId(row, col));
            if((findPiece && !findPiece.firstChild.classList.contains(colorOfMyPiece))){
                this.highlight(this.getSquareId(row, col), is_it_highlighted);
                break;
            }
            if(!findPiece){
                this.highlight(this.getSquareId(row, col), is_it_highlighted);
            }else{
                break;
            }
        }
        // Dawn Left
        for (let row = currentRowCol[0] - 1 , col = currentRowCol[1] - 1; row >= 0 && col >= 0 ; row--, col--){
            const findPiece = this.findPiece(this.getSquareId(row, col));
            if((findPiece && !findPiece.firstChild.classList.contains(colorOfMyPiece))){
                this.highlight(this.getSquareId(row, col), is_it_highlighted);
                break;
            }
            if(!findPiece){
                this.highlight(this.getSquareId(row, col), is_it_highlighted);
            }else{
                break;
            }
        }
        // Down Right
        for (let row = currentRowCol[0] + 1 , col = currentRowCol[1] - 1; row < this.width && col >= 0 ; row++, col--){
            const findPiece = this.findPiece(this.getSquareId(row, col));
            if((findPiece && !findPiece.firstChild.classList.contains(colorOfMyPiece))){
                this.highlight(this.getSquareId(row, col), is_it_highlighted);
                break;
            }
            if(!findPiece){
                this.highlight(this.getSquareId(row, col), is_it_highlighted);
            }else{
                break;
            }
        }
        // Up Left
        for (let row = currentRowCol[0] - 1 , col = currentRowCol[1] + 1; row >= 0 && col < this.width ; row--, col++){
            const findPiece = this.findPiece(this.getSquareId(row, col));
            if((findPiece && !findPiece.firstChild.classList.contains(colorOfMyPiece))){
                this.highlight(this.getSquareId(row, col), is_it_highlighted);
                break;
            }
            if(!findPiece){
                this.highlight(this.getSquareId(row, col), is_it_highlighted);
            }else{
                break;
            }
        }
    }
    highlightPathOfQueen(currentRowCol, colorOfMyPiece, is_it_highlighted){
        this.highlightPathOfBishop(currentRowCol, colorOfMyPiece, is_it_highlighted);
        this.highlightPathOfRook(currentRowCol, colorOfMyPiece, is_it_highlighted);
    }
}


