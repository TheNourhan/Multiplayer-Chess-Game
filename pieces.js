class Pieces{

    constructor(width) {
        this.width = width;
    }
    getRowCol(startId, targetId){
        // Calculate the row and column indices for the starting
        const startRow = Math.floor(startId / this.width);
        const startCol = startId % this.width;
        // Calculate the row and column indices for the target square
        const targetRow = Math.floor(targetId / this.width);
        const targetCol = targetId % this.width;
    
        return [startRow,startCol,targetRow,targetCol];
    }
    findPiece(squareId){
        return document.querySelector(`[square-id="${squareId}"]`).firstChild;
    }
    isValidPawnMove(startId, targetId){
        const starterRow = [8,9,10,11,12,13,14,15];
        if((starterRow.includes(startId) && (startId + this.width * 2 === targetId) && !(this.findPiece(startId + this.width))) || 
            (startId + this.width === targetId) && (!(this.findPiece(startId + this.width))) || 
            (startId + this.width - 1 === targetId) && this.findPiece(startId + this.width - 1) || 
            (startId + this.width + 1 === targetId) && this.findPiece(startId + this.width + 1)){
            return true;
        }
        return false;
    }
    isValidBishopMove(startId, targetId) {
        const [startRow, startCol, targetRow, targetCol] = this.getRowCol(startId, targetId);
        const rowDistance = Math.abs(targetRow - startRow);
        const colDistance = Math.abs(targetCol - startCol);
        // Check if the move is diagonal
        if (rowDistance === colDistance) {
            // Check for pieces in the way
            for (let i = 1; i < rowDistance; i++) {
                const intermediateRow = startRow + (i * Math.sign(targetRow - startRow));
                const intermediateCol = startCol + (i * Math.sign(targetCol - startCol));
                const intermediateSquareId = intermediateRow * this.width + intermediateCol;
                
                if (document.querySelector(`[square-id="${intermediateSquareId}"]`).firstChild) {
                    return false;
                }
            }
            // No pieces in the way, the move is valid
            return true;
        }
        // Not a diagonal move
        return false;
    }
    isValidRookMove(startId, targetId) {
        const [startRow, startCol, targetRow, targetCol] = this.getRowCol(startId, targetId);
        // Check if the move is along the same row or same column
        if (startRow === targetRow) {
            // Check for pieces in the way horizontally
            const minCol = Math.min(startCol, targetCol);
            const maxCol = Math.max(startCol, targetCol);
            for (let col = minCol + 1; col < maxCol; col++) {
                const intermediateSquareId = startRow * this.width + col;//get colId in this row
                if (document.querySelector(`[square-id="${intermediateSquareId}"]`).firstChild) {
                    return false;
                }
            }
            return true;
        } else if (startCol === targetCol) {
            // Check for pieces in the way vertically
            const minRow = Math.min(startRow, targetRow);
            const maxRow = Math.max(startRow, targetRow);
            for (let row = minRow + 1; row < maxRow; row++) {
                const intermediateSquareId = row * this.width + startCol;
                if (document.querySelector(`[square-id="${intermediateSquareId}"]`).firstChild) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    isValidQueenMove(startId, targetId) {
        return this.isValidBishopMove(startId, targetId) || this.isValidRookMove(startId, targetId);
    }
    isValidKnightMove(startId, targetId){
        const [startRow,startCol,targetRow,targetCol] = this.getRowCol(startId, targetId);
        const rowDistance = Math.abs(targetRow - startRow);
        const colDistance = Math.abs(targetCol - startCol);
        /*
        const targetSquare = document.querySelector(`[square-id="${targetId}"]`);
        if (targetSquare) {
            const svgElement = targetSquare.children.target;
            console.log(svgElement)
        
            if (svgElement) {
                // Now, 'svgElement' contains the SVG element inside the specified square
                console.log(svgElement);
            } else {
                console.log('No SVG element found inside the specified square.');
            }
        } else {
            console.log('No square found with the specified square-id.');
        }*/

        //console.log(svgElement)
        //const svgClass = targetSquare?.querySelector('.piece svg')?.getAttribute('class');
        
       // console.log('Class attribute value:', svgClass);
        // Check if the move is in an "L" shape (2 squares in one direction and 1 square perpendicular)
        return (rowDistance === 2 && colDistance === 1) || (rowDistance === 1 && colDistance === 2);
    }
    isValidKingMove(startId, targetId) {
        const [startRow,startCol,targetRow,targetCol] = this.getRowCol(startId, targetId);
    
        const rowDistance = Math.abs(targetRow - startRow);
        const colDistance = Math.abs(targetCol - startCol);
    
        // Check if the move is within one square in any direction
        return rowDistance <= 1 && colDistance <= 1;
    } 
}
class HighlightPath{

    constructor(width){
        this.width = width;
    }
    getSquareId(row, col) {
        return row * 8 + col;
    }
    highlight(squareId, is_it_highlighted){
        let parentDiv = document.querySelector(`[square-id="${squareId}"]`);
        if(is_it_highlighted){
            parentDiv.style.backgroundColor = "rgb(139, 91, 172)";
        }else{
            if(parentDiv.classList.contains('blue')){
                parentDiv.style.backgroundColor = 'rgba(0, 145, 255, 0.728)';
            }else if(parentDiv.classList.contains('grey')){
                parentDiv.style.backgroundColor = 'rgb(188, 188, 188)';
            }
        }
    }
    findPiece(squareId){
        return document.querySelector(`[square-id="${squareId}"]`).firstChild;
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
        if((starterRow.includes(squareId) && !(document.querySelector(`[square-id="${squareId + this.width}"]`).firstChild) &&
        !(document.querySelector(`[square-id="${squareId + this.width * 2}"]`).firstChild))){
            this.highlight(squareId + this.width, is_it_highlighted)
            this.highlight(squareId + this.width * 2, is_it_highlighted)
        }else if(!(document.querySelector(`[square-id="${squareId + this.width}"]`).firstChild)){
            this.highlight(squareId + this.width, is_it_highlighted)
        }
        
        if(document.querySelector(`[square-id="${squareId + this.width - 1}"]`).firstChild &&
        !document.querySelector(`[square-id="${squareId + this.width - 1}"]`).firstChild.firstChild.classList.contains(colorOfMyPiece)){
            this.highlight(squareId + this.width - 1, is_it_highlighted)
        }else if(document.querySelector(`[square-id="${squareId + this.width + 1}"]`).firstChild &&
        !document.querySelector(`[square-id="${squareId + this.width + 1}"]`).firstChild.firstChild.classList.contains(colorOfMyPiece)){
        this.highlight(squareId + this.width + 1, is_it_highlighted)
        }
    }
    highlightPathOfKnight(currentRowCol, colorOfMyPiece, is_it_highlighted){
        const possibleMoves = [];
        const moves = [ [-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1] ];
        for (const move of moves) {
            let newPosition = [currentRowCol[0] + move[0], currentRowCol[1] + move[1]];
            // Check if the new position is on the chessboard (assuming an 8x8 board)
            if (newPosition[0] >= 0 && newPosition[0] < 8 && newPosition[1] >= 0 && newPosition[1] < 8) {
                possibleMoves.push(newPosition);
            }
        }
        const allSquares = document.querySelectorAll(".square");
        allSquares.forEach((square, i) => {
            // Convert square ID to number before comparing
            const squareId = parseInt(square.getAttribute('square-id'), 10);
            if (possibleMoves.some(move => this.getSquareId(move[0], move[1]) === squareId)) {
                const pieceElement = square.querySelector('.piece svg');
                if (!pieceElement || pieceElement && pieceElement.getAttribute('class') != colorOfMyPiece){
                    this.highlight(squareId, is_it_highlighted)
                }
            }         
        });
    }
    highlightPathOfKing(currentRowCol, colorOfMyPiece, is_it_highlighted){
        const squareId = this.getSquareId(currentRowCol[0], currentRowCol[1]);
        if(document.querySelector(`[square-id="${squareId + this.width}"]`)){
            const findPiece = this.findPiece(squareId + this.width);
            if(!findPiece || (findPiece && !findPiece.firstChild.classList.contains(colorOfMyPiece))){
                this.highlight(squareId + this.width, is_it_highlighted);
            }  
        }
        if(document.querySelector(`[square-id="${squareId - this.width}"]`)){
            const findPiece = this.findPiece(squareId - this.width);
            if(!findPiece || (findPiece && !findPiece.firstChild.classList.contains(colorOfMyPiece))){
                this.highlight(squareId - this.width, is_it_highlighted);
            } 
        }
        if(document.querySelector(`[square-id="${squareId + this.width + 1}"]`)){
            const findPiece = this.findPiece(squareId + this.width + 1);
            if(!findPiece || (findPiece && !findPiece.firstChild.classList.contains(colorOfMyPiece))){
                this.highlight(squareId + this.width + 1, is_it_highlighted);
            } 
        }
        if(document.querySelector(`[square-id="${squareId + this.width - 1}"]`)){
            const findPiece = this.findPiece(squareId + this.width - 1);
            if(!findPiece || (findPiece && !findPiece.firstChild.classList.contains(colorOfMyPiece))){
                this.highlight(squareId + this.width - 1, is_it_highlighted);
            } 
        }
        if(document.querySelector(`[square-id="${squareId - this.width + 1}"]`)){
            const findPiece = this.findPiece(squareId - this.width + 1);
            if(!findPiece || (findPiece && !findPiece.firstChild.classList.contains(colorOfMyPiece))){
                this.highlight(squareId - this.width + 1, is_it_highlighted);
            } 
        }
        if(document.querySelector(`[square-id="${squareId - this.width - 1}"]`)){
            const findPiece = this.findPiece(squareId - this.width - 1);
            if(!findPiece || (findPiece && !findPiece.firstChild.classList.contains(colorOfMyPiece))){
                this.highlight(squareId - this.width - 1, is_it_highlighted);
            } 
        }
        if(document.querySelector(`[square-id="${squareId + 1}"]`)){
            const findPiece = this.findPiece(squareId + 1);
            if(!findPiece || (findPiece && !findPiece.firstChild.classList.contains(colorOfMyPiece))){
                this.highlight(squareId + 1, is_it_highlighted);
            } 
        }
        if(document.querySelector(`[square-id="${squareId - 1}"]`)){
            const findPiece = this.findPiece(squareId - 1);
            if(!findPiece || (findPiece && !findPiece.firstChild.classList.contains(colorOfMyPiece))){
                this.highlight(squareId - 1, is_it_highlighted);
            } 
        }
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




/*
    isValidBishopMove0(startId, targetId) {
        const [startRow,startCol,targetRow,targetCol] = this.getRowCol(startId, targetId);
        // Calculate the absolute differences in rows and columns
        const rowDistance = Math.abs(targetRow - startRow);// num of step
        const colDistance = Math.abs(targetCol - startCol);
        console.log(startRow, startCol)
        // Check if the move is diagonal (absolute row distance equals absolute column distance)
        for(let row=startRow,col=startCol;col<8, row<8 ;col++,row++){
            //for(let col=startCol;col<8;col++){
                if(col===row+2){
                    console.log(row, col)
                }
            //}
            //let h = document.querySelectorAll();
        }
        return rowDistance === colDistance;
    }
*/
/*
    isValidRookMove(startId, targetId) {
        const [startRow,startCol,targetRow,targetCol] = this.getRowCol(startId, targetId);
         // Check if the move is along the same row or same column
        return startRow === targetRow || startCol === targetCol;
    }
*/
            
            