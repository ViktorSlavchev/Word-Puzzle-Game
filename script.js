const url = window.location.search;
const params = new URLSearchParams(url);

const boardSize = +params.get("size") || 5;
const levelPieces = getLevel(boardSize).pieces;
console.log(levelPieces);

const positions = [
	{ x: 50, y: 100 },
	{ x: 250, y: 100 },
	{ x: 50, y: 400 },
	{ x: 250, y: 400 },
	{ x: window.innerWidth - 250, y: 100 },
];

const pieces = levelPieces.map((piece, ind) => new Piece(positions[ind].x, positions[ind].y, piece));
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
