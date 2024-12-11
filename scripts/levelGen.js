// TrieNode Class and buildTrie Function must be declared before usage
class TrieNode {
	constructor() {
		this.children = {};
		this.isEndOfWord = false;
	}
}

function getLevel(boardSize = 4) {
	console.log("Generating level with board size:", boardSize);

	function buildTrie(dictionary) {
		const root = new TrieNode();
		for (const word of dictionary) {
			let node = root;
			for (const char of word) {
				if (!node.children[char]) node.children[char] = new TrieNode();
				node = node.children[char];
			}
			node.isEndOfWord = true;
		}
		return root;
	}

	// Make sure you have a `dictionary` array defined somewhere above
	const trieRoot = buildTrie(dictionary);

	const piecesTemplates = [
		{
			name: "RightHand",
			blocks: [
				{ x: 0, y: 0 },
				{ x: 1, y: 0 },
				{ x: 1, y: 1 },
			],
		},
		{
			name: "LeftHand",
			blocks: [
				{ x: 0, y: 0 },
				{ x: 1, y: 0 },
				{ x: 0, y: 1 },
			],
		},
		{
			name: "SmallStraight",
			blocks: [
				{ x: 0, y: 0 },
				{ x: 0, y: 1 },
			],
		},
		{
			name: "TallStraight",
			blocks: [
				{ x: 0, y: 0 },
				{ x: 0, y: 1 },
				{ x: 0, y: 2 },
			],
		},
		{
			name: "TShape",
			blocks: [
				{ x: 0, y: 0 },
				{ x: -1, y: 1 },
				{ x: 0, y: 1 },
				{ x: 0, y: 2 },
			],
		},

	];

	let board = Array.from({ length: boardSize }, () =>
		Array.from({ length: boardSize }, () => ({ pieceId: null, letter: null }))
	);

	let solverStartTime;
	const SOLVER_TIME_LIMIT = 5000; // Time limit in milliseconds

	let placedPieces = [];


	function isAdjecentToPlacedPiece(board, piece, offsetX, offsetY) {
		const adjacentOffsets = [
			{ x: -1, y: 0 }, // Left
			{ x: 1, y: 0 },  // Right
			{ x: 0, y: -1 }, // Up
			{ x: 0, y: 1 },  // Down
		];

		for (const block of piece.blocks) {
			const x = offsetX + block.x;
			const y = offsetY + block.y;

			for (const offset of adjacentOffsets) {
				const adjX = x + offset.x;
				const adjY = y + offset.y;

				if (adjX >= 0 && adjY >= 0 && adjX < boardSize && adjY < boardSize) {
					if (board[adjY][adjX].pieceId !== null) {
						return true;
					}
				}
			}
		}

		return false; // No adjacent piece found
	}

	function generateField() {
		// Reset board
		board = Array.from({ length: boardSize }, () =>
			Array.from({ length: boardSize }, () => ({ pieceId: null, letter: null }))
		);

		let piecesToPlace = [...piecesTemplates];
		shuffleArray(piecesToPlace);
		let isFirstPiece = true;

		for (let i = 0; i < piecesToPlace.length; i++) {
			const piece = piecesToPlace[i];
			let placed = false;

			// Generate all possible positions on the board
			let positions = [];
			for (let y = 0; y < boardSize; y++) {
				for (let x = 0; x < boardSize; x++) {
					positions.push({ x, y });
				}
			}

			// Shuffle positions to randomize the placement order
			shuffleArray(positions);

			// Try to place the piece in each position
			for (const pos of positions) {
				if (
					canPlacePiece(board, piece, pos.x, pos.y) &&
					(isFirstPiece || isAdjecentToPlacedPiece(board, piece, pos.x, pos.y))
				) {
					isFirstPiece = false;
					placePiece(board, piece, pos.x, pos.y, i + 1);
					placedPieces.push({ x: pos.x, y: pos.y, piece });
					placed = true;
					break;
				}
			}
			// If not placed, it's okay. We just skip it.
		}

		const words = getWords(board);
	}

	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	function printBoard(board) {
		for (const row of board) {
			console.log(
				row
					.map((cell) => {
						if (cell.letter !== null) {
							return cell.letter;
						} else if (cell.pieceId !== null) {
							return cell.pieceId;
						} else {
							return "_";
						}
					})
					.join(" ")
			);
		}
		console.log("");
	}

	function canPlacePiece(board, piece, offsetX, offsetY) {
		for (const block of piece.blocks) {
			const x = offsetX + block.x;
			const y = offsetY + block.y;
			if (
				x < 0 ||
				y < 0 ||
				x >= boardSize ||
				y >= boardSize ||
				board[y][x].pieceId !== null
			) {
				return false;
			}
		}
		return true;
	}

	function placePiece(board, piece, offsetX, offsetY, pieceId) {
		for (const block of piece.blocks) {
			const x = offsetX + block.x;
			const y = offsetY + block.y;
			board[y][x].pieceId = pieceId;
		}
	}

	function getWords(board) {
		const words = [];

		// Rows
		for (let i = 0; i < boardSize; i++) {
			let startWord = null,
				activeWord = false;
			for (let j = 0; j < boardSize; j++) {
				if (board[i][j].pieceId === null) {
					if (activeWord) words.push({ start: [i, startWord], end: [i, j - 1] });
					activeWord = false;
				} else {
					if (!activeWord) startWord = j;
					activeWord = true;
				}

				if (j === boardSize - 1 && activeWord) words.push({ start: [i, startWord], end: [i, j] });
			}
		}

		// Columns
		for (let i = 0; i < boardSize; i++) {
			let startWord = null,
				activeWord = false;
			for (let j = 0; j < boardSize; j++) {
				if (board[j][i].pieceId === null) {
					if (activeWord) words.push({ start: [startWord, i], end: [j - 1, i] });
					activeWord = false;
				} else {
					if (!activeWord) startWord = j;
					activeWord = true;
				}

				if (j === boardSize - 1 && activeWord) words.push({ start: [startWord, i], end: [j, i] });
			}
		}

		return words.filter((word) => word.end[0] - word.start[0] > 0 || word.end[1] - word.start[1] > 0);
	}

	function placeWords(board, words, trieRoot) {
		solverStartTime = Date.now();
		const usedWords = new Set();
		let changedCellsStack = []; // Stack to track changes for backtracking

		function getSlotPattern(slot) {
			const [x1, y1] = slot.start;
			const [x2, y2] = slot.end;
			const isHorizontal = x1 === x2;

			let pattern = "";
			for (let i = 0; i <= Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)); i++) {
				const x = isHorizontal ? x1 : x1 + i;
				const y = isHorizontal ? y1 + i : y1;
				const cell = board[x][y];
				if (cell.letter !== null) {
					pattern += cell.letter;
				} else {
					pattern += ".";
				}
			}
			return pattern;
		}

		function findWordsForPattern(node, pattern, index, currentWord, results, usedWords, maxResults = 100) {
			if (Date.now() - solverStartTime > SOLVER_TIME_LIMIT) {
				return; // Abort if time limit exceeded
			}
			if (results.length >= maxResults) {
				return; // Limit number of results
			}
			if (index === pattern.length) {
				if (node.isEndOfWord && !usedWords.has(currentWord)) {
					results.push(currentWord);
				}
				return;
			}

			const char = pattern[index];
			if (char !== ".") {
				if (node.children[char]) {
					findWordsForPattern(node.children[char], pattern, index + 1, currentWord + char, results, usedWords, maxResults);
				}
			} else {
				for (const childChar in node.children) {
					findWordsForPattern(node.children[childChar], pattern, index + 1, currentWord + childChar, results, usedWords, maxResults);
				}
			}
		}

		const slotPossibilities = [];
		for (const slot of words) {
			const pattern = getSlotPattern(slot);
			const possibleWords = [];
			findWordsForPattern(trieRoot, pattern, 0, "", possibleWords, usedWords, 100);

			if (possibleWords.length === 0) {
				return null; // No possible words for this slot
			}
			slotPossibilities.push({ slot, possibleWords });
		}

		slotPossibilities.sort((a, b) => a.possibleWords.length - b.possibleWords.length);

		function canPlaceWord(word, slot) {
			const [x1, y1] = slot.start;
			const [x2, y2] = slot.end;
			const isHorizontal = x1 === x2;

			for (let i = 0; i < word.length; i++) {
				const x = isHorizontal ? x1 : x1 + i;
				const y = isHorizontal ? y1 + i : y1;
				const cell = board[x][y];
				if (cell.pieceId === null) return false;
				if (cell.letter !== null && cell.letter !== word[i]) return false;
			}
			return true;
		}

		function placeWord(word, slot) {
			const [x1, y1] = slot.start;
			const [x2, y2] = slot.end;
			const isHorizontal = x1 === x2;

			const changedCells = [];
			for (let i = 0; i < word.length; i++) {
				const x = isHorizontal ? x1 : x1 + i;
				const y = isHorizontal ? y1 + i : y1;
				const oldLetter = board[x][y].letter;
				if (oldLetter !== word[i]) {
					board[x][y].letter = word[i];
					changedCells.push({ x, y, oldLetter });
				}
			}
			usedWords.add(word);
			changedCellsStack.push({ word, changedCells });
		}

		function removeWord() {
			const { word, changedCells } = changedCellsStack.pop();
			for (const { x, y, oldLetter } of changedCells) {
				board[x][y].letter = oldLetter;
			}
			usedWords.delete(word);
		}

		function solve(index) {
			if (Date.now() - solverStartTime > SOLVER_TIME_LIMIT) {
				return false; // Time limit exceeded
			}

			if (index === slotPossibilities.length) return true;

			const { slot } = slotPossibilities[index];

			const pattern = getSlotPattern(slot);
			const possibleWords = [];
			findWordsForPattern(trieRoot, pattern, 0, "", possibleWords, usedWords, 100);
			if (possibleWords.length === 0) return false;

			possibleWords.sort(() => Math.random() - 0.5); // Randomize word order for better results
			for (const word of possibleWords) {
				if (canPlaceWord(word, slot)) {
					placeWord(word, slot);
					// Forward checking or additional checks can be done here
					if (solve(index + 1)) return true;
					removeWord();
				}
			}
			return false;
		}

		return solve(0) ? board : null;
	}

	function convertBoardToPieces(board) {
		const pieces = [];
		for (let i = 0; i < placedPieces.length; i++) {
			const { x, y, piece } = placedPieces[i];
			const pieceBlocks = [];
			for (const block of piece.blocks) {
				const cell = board[y + block.y][x + block.x];
				pieceBlocks.push({ x: block.x, y: block.y, letter: cell.letter });
			}
			pieces.push({ name: piece.name, blocks: pieceBlocks });
		}
		return pieces;
	}

	function generateLevel() {
		const maxAttempts = 50; // Limit the number of attempts
		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			board = Array.from({ length: boardSize }, () =>
				Array.from({ length: boardSize }, () => ({ pieceId: null, letter: null }))
			);
			placedPieces = [];
			generateField();

			let numberBoard = JSON.parse(JSON.stringify(board));
			const words = getWords(board);

			const test = placeWords(board, words, trieRoot);
			if (test) {
				printBoard(test);
				return {
					pieces: convertBoardToPieces(test),
				};
			}
		}
		console.error("Failed to generate a solvable level within the maximum attempts.");
	}

	return generateLevel();
}
