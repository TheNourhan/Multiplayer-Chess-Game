export default class Pieces{

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
