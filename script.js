const boardSize = 5;
const levelPieces = getLevel(boardSize).pieces;
console.log(levelPieces);

const pieces = levelPieces.map((piece, ind) => new Piece(ind * 200, 100, piece));
const board = new Board(boardSize);

// Add event listeners to each piece
let draggedPiece = null;
let offsetX, offsetY;

pieces.forEach((piece) => {
	piece.element.addEventListener("mousedown", (e) => onMouseDown(e, piece));
});

function onMouseDown(event, piece) {
	draggedPiece = piece;
	offsetX = event.clientX - piece.element.getBoundingClientRect().left;
	offsetY = event.clientY - piece.element.getBoundingClientRect().top;

	if (piece.isPlaced) {
		board.unPlacePiece(piece);
	}
}

function onMouseMove(event) {
	if (!draggedPiece) return;

	board.checkIfPieceFits(draggedPiece);
	draggedPiece.move(event.clientX - offsetX, event.clientY - offsetY);
}

function onMouseUp() {
	if (!draggedPiece) return;

	const square = board.checkIfPieceFits(draggedPiece);
	if (square) {
		board.placePiece(draggedPiece, square);
	}

	draggedPiece = null;
}

document.addEventListener("mousemove", onMouseMove);
document.addEventListener("mouseup", onMouseUp);
