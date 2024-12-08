const url = window.location.search;
const params = new URLSearchParams(url);

let diffcultyString;
let seed;

if (params.has("free-play")) {
	diffcultyString = params.get("difficulty") || "medium";

	if (!["easy", "medium", "hard", "testing"].includes(diffcultyString)) {
		diffcultyString = "medium";
	}

	if (params.has("seed")) {
		seed = params.get("seed");
	} else {
		seed = `${Math.floor(Math.random() * 10000000)}`;
	}

	Math.seedrandom(seed);
	// console.log("Seed:", seed);

	document.querySelector(".btn-gamemode span").textContent = "Free Play";
	document.querySelector(".controlls-date").classList.add("displaynone");
	document.querySelector(".dropdown").classList.remove("displaynone");
	document.querySelector(".current-diff").textContent = diffcultyString[0].toUpperCase() + diffcultyString.slice(1);
} else {
	diffcultyString = setUpDailyGame();
	document.querySelector(".controlls-date").textContent = formatDate(new Date());
}

const boardSize = +params.get("size") || (diffcultyString === "easy" ? 4 : diffcultyString === "medium" ? 5 : 6);
const levelPieces = getLevel(boardSize).pieces;
// console.log(levelPieces);


const board = new Board(boardSize);
const pieces = levelPieces.map((piece, ind) => new Piece(0, 0, piece));
const positions = getPiecesPostions(pieces);

// Add event listeners to each piece
let draggedPiece = null;
let offsetX, offsetY;

pieces.forEach((piece) => {
	piece.element.addEventListener("mousedown", (e) => onMouseDown(e, piece));
	piece.element.addEventListener("touchstart", (e) => onMouseDown(e, piece));
});

function onMouseDown(event, piece) {
	if (event.touches) event = event.touches[0];

	draggedPiece = piece;
	offsetX = event.clientX - piece.element.getBoundingClientRect().left;
	offsetY = event.clientY - piece.element.getBoundingClientRect().top;

	if (piece.isPlaced) {
		board.unPlacePiece(piece);
	}
}

function onMouseMove(event) {
	if (event.touches) event = event.touches[0];
	if (!draggedPiece) return;

	board.checkIfPieceFits(draggedPiece);
	draggedPiece.move(event.clientX - offsetX, event.clientY - offsetY);
}

function onMouseUp(e) {
	if (!draggedPiece) return;

	const square = board.checkIfPieceFits(draggedPiece);
	if (square) {
		board.placePiece(draggedPiece, square);
	}

	draggedPiece = null;
}

document.addEventListener("mousemove", onMouseMove);
document.addEventListener("mouseup", onMouseUp);
document.addEventListener("touchmove", onMouseMove);
document.addEventListener("touchend", onMouseUp);


window.addEventListener("resize", () => {
	// Update positions for each piece for the new window size and square postiotions
	const bodyRect = document.body.getBoundingClientRect();
	pieces.forEach((piece, ind) => {
		if (piece.isPlaced) {
			const { x, y } = piece.boardPosition;
			const square = board.getSqureByCoordinates(piece.type === "TShape" ? x - 1 : x, y);
			piece.moveWithOutAnimation(square.getBoundingClientRect().x - bodyRect.x, square.getBoundingClientRect().y - bodyRect.y);
		}
	});

	document.querySelector(".controls-holder").style.width = document.querySelector(".game-board").getBoundingClientRect().width + "px";
	document.querySelector(".headline").style.width = Math.max(document.querySelector(".game-board").getBoundingClientRect().width, document.querySelector(".headline h1").getBoundingClientRect().width + 120) + "px";
});


document.querySelector(".controls-holder").style.width = document.querySelector(".game-board").getBoundingClientRect().width + "px";
document.querySelector(".headline").style.width = Math.max(document.querySelector(".game-board").getBoundingClientRect().width, document.querySelector(".headline h1").getBoundingClientRect().width + 120) + "px";


document.querySelector(".btn-reset").addEventListener("click", () => {
	pieces.forEach((piece) => {
		if (piece.isPlaced) {
			board.unPlacePiece(piece);
		}
		piece.resetPosition();
	});

	board.reset();
	board.removeHighlights();
});


if (localStorage.getItem("show-tutorial") !== "false") {
	showHelpModal();
	localStorage.setItem("show-tutorial", "false");
}

