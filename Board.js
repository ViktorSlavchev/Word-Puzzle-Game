const boardElement = document.querySelector(".game-board");

class Board {
	constructor(size) {
		this.size = size;
		this.boardSquares = [];
		this.boardSquaresElements = [];
		this.generateBoardElements();
	}

	generateBoardElements() {
		for (let i = 0; i < this.size; i++) {
			this.boardSquares.push([]);
			for (let j = 0; j < this.size; j++) {
				const square = document.createElement("div");
				square.classList.add("board-square");
				square.style.gridColumn = j + 1;
				square.style.gridRow = i + 1;
				square.dataset.x = j;
				square.dataset.y = i;

				boardElement.appendChild(square);
				this.boardSquares[i].push(null);
				this.boardSquaresElements.push(square);
			}
		}
	}

	getSqureByCoordinates(x, y) {
		return this.boardSquaresElements.find((square) => {
			return +square.dataset.x === x && +square.dataset.y === y;
		});
	}

	findClosestSquare(piece) {
		let closestSquare = null;
		let minDistance = Infinity;

		for (let i = 0; i < this.boardSquaresElements.length; i++) {
			const square = this.boardSquaresElements[i];
			const squareRect = square.getBoundingClientRect();
			const pieceRect = piece.element.getBoundingClientRect();

			if (piece.type === "TShape") {
				pieceRect.x += pieceRect.width / 2;
			}

			const distance = Math.sqrt(Math.pow(squareRect.x - pieceRect.x, 2) + Math.pow(squareRect.y - pieceRect.y, 2));

			if (distance < minDistance) {
				minDistance = distance;
				closestSquare = square;
			}
		}

		return { closestSquare, minDistance };
	}

	isIn(x, y) {
		return x >= 0 && x < this.size && y >= 0 && y < this.size;
	}

	checkIfPieceIsIn(piece, square) {
		const { x, y } = square.dataset;

		for (let i = 0; i < piece.bricks.length; i++) {
			const brick = piece.bricks[i];
			const newX = parseInt(x) + brick.x;
			const newY = parseInt(y) + brick.y;

			if (!this.isIn(newX, newY) || this.boardSquares[newY][newX]) {
				return false;
			}
		}

		return true;
	}

	removeHighlights() {
		this.boardSquaresElements.forEach((square) => {
			square.classList.remove("highlight");
		});
	}

	highlightSquares(squares) {
		this.removeHighlights();

		for (let i = 0; i < squares.length; i++) {
			const { x, y } = squares[i];
			const square = this.getSqureByCoordinates(x, y);
			square.classList.add("highlight");
		}
	}

	checkIfPieceFits(piece) {
		const { closestSquare, minDistance } = this.findClosestSquare(piece);

		this.removeHighlights();
		if (!closestSquare) return;
		if (minDistance > 100) return;
		if (!this.checkIfPieceIsIn(piece, closestSquare)) return;

		const { x, y } = closestSquare.dataset;
		const squares = [];
		for (let i = 0; i < piece.bricks.length; i++) {
			const brick = piece.bricks[i];
			const newX = parseInt(x) + brick.x;
			const newY = parseInt(y) + brick.y;
			squares.push({ x: newX, y: newY });
		}

		this.highlightSquares(squares);

		return closestSquare;
	}

	placePiece(piece, square) {
		const { x, y } = square.dataset;

		if (piece.type === "TShape") {
			square = this.getSqureByCoordinates(parseInt(x) - 1, parseInt(y));
			piece.move(square.getBoundingClientRect().x, square.getBoundingClientRect().y);
		} else {
			piece.move(square.getBoundingClientRect().x, square.getBoundingClientRect().y);
		}

		for (let i = 0; i < piece.bricks.length; i++) {
			const brick = piece.bricks[i];
			const newX = parseInt(x) + brick.x;
			const newY = parseInt(y) + brick.y;

			this.boardSquares[newY][newX] = piece;
		}

		piece.isPlaced = true;
		piece.boardPosition = { x: parseInt(x), y: parseInt(y) };
		piece.element.style.zIndex = 15;
		console.log(this.boardSquares);
	}

	unPlacePiece(piece) {
		if (!piece.isPlaced) return;

		const { x, y } = piece.boardPosition;
		for (let i = 0; i < piece.bricks.length; i++) {
			const brick = piece.bricks[i];
			const newX = x + brick.x;
			const newY = y + brick.y;

			this.boardSquares[newY][newX] = null;
		}

		piece.isPlaced = false;
		piece.boardPosition = null;
		piece.element.style.zIndex = 20;
	}
}
