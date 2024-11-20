// TrieNode Class and buildTrie Function must be declared before usage
class TrieNode {
	constructor() {
		this.children = {};
		this.isEndOfWord = false;
	}
}

function getLevel(boardSize = 4) {
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

	// Build the trie once
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

	let board = Array.from({ length: boardSize }, () => Array.from({ length: boardSize }, () => ({ pieceId: null, letter: null })));

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


	// Generate field and find words in rows and columns
	function generateField() {
		// Reset board
		board = Array.from({ length: boardSize }, () => Array.from({ length: boardSize }, () => ({ pieceId: null, letter: null })));

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
				// console.log(`Trying to place piece: ${piece.name} at ${pos.x}, ${pos.y}`, isFirstPiece, isAdjecentToPlacedPiece(board, piece, pos.x, pos.y));
				if (canPlacePiece(board, piece, pos.x, pos.y) && (isFirstPiece || isAdjecentToPlacedPiece(board, piece, pos.x, pos.y))) {
					isFirstPiece = false;
					placePiece(board, piece, pos.x, pos.y, i + 1);
					placedPieces.push({ x: pos.x, y: pos.y, piece });
					placed = true;
					break;
				}
			}

			if (!placed) {
				// console.log(`Could not place piece: ${piece.name}`);
			}
		}

		console.log("Generated Field:");
		printBoard(board);
		const words = getWords(board);
		// console.log("Words:", JSON.stringify(words), "");

		// Uncomment these lines if you want to run the solver
		// const test = crosswordSolver(board, words, trieRoot);
		// if (test) {
		//     console.log("Final Board:");
		//     printBoard(test);
		// } else {
		//     console.log("No solution found within time limit.");
		// }
	}

	// Helper functions for shuffling and printing
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
					.join(" "),
				""
			);
		}

		console.log("");
	}

	// Place and remove pieces on the board
	function canPlacePiece(board, piece, offsetX, offsetY) {
		for (const block of piece.blocks) {
			const x = offsetX + block.x;
			const y = offsetY + block.y;
			if (x < 0 || y < 0 || x >= boardSize || y >= boardSize || board[y][x].pieceId !== null) {
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

	// Find words on the board
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

	// Crossword Solver
	function placeWords(board, words, trieRoot) {
		solverStartTime = Date.now();
		const usedWords = new Set();

		// Helper function to generate a pattern for a slot
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

		// Function to find all possible words matching a pattern using the trie
		function findWordsForPattern(node, pattern, index, currentWord, results, usedWords, maxResults = 100) {
			if (Date.now() - solverStartTime > SOLVER_TIME_LIMIT) {
				return; // Abort if time limit exceeded
			}
			if (results.length >= maxResults) {
				return; // Limit the number of possible words to consider
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

		// Forward Checking: Precompute possible words for each slot
		const slotPossibilities = [];
		for (const slot of words) {
			const pattern = getSlotPattern(slot);
			const possibleWords = [];
			findWordsForPattern(trieRoot, pattern, 0, "", possibleWords, usedWords, 100); // Limit to 100 words per slot

			if (possibleWords.length === 0) {
				return null; // No possible words, backtrack
			}
			slotPossibilities.push({ slot, possibleWords });
		}

		// Sort slots by the number of possible words (most constrained first)
		slotPossibilities.sort((a, b) => a.possibleWords.length - b.possibleWords.length);

		function canPlaceWord(word, slot) {
			const [x1, y1] = slot.start;
			const [x2, y2] = slot.end;
			const isHorizontal = x1 === x2;

			for (let i = 0; i < word.length; i++) {
				const x = isHorizontal ? x1 : x1 + i;
				const y = isHorizontal ? y1 + i : y1;
				const cell = board[x][y];
				if (cell.pieceId === null) {
					return false;
				}
				if (cell.letter !== null && cell.letter !== word[i]) {
					return false;
				}
			}
			return true;
		}

		function placeWord(word, slot) {
			const [x1, y1] = slot.start;
			const [x2, y2] = slot.end;
			const isHorizontal = x1 === x2;

			for (let i = 0; i < word.length; i++) {
				const x = isHorizontal ? x1 : x1 + i;
				const y = isHorizontal ? y1 + i : y1;
				board[x][y].letter = word[i];
			}
			usedWords.add(word);
		}

		function removeWord(word, slot) {
			const [x1, y1] = slot.start;
			const [x2, y2] = slot.end;
			const isHorizontal = x1 === x2;

			for (let i = 0; i < word.length; i++) {
				const x = isHorizontal ? x1 : x1 + i;
				const y = isHorizontal ? y1 + i : y1;
				board[x][y].letter = null;
			}
			usedWords.delete(word);
		}

		function solve(index) {
			if (Date.now() - solverStartTime > SOLVER_TIME_LIMIT) {
				return false; // Abort if time limit exceeded
			}

			if (index === slotPossibilities.length) return true;

			const { slot } = slotPossibilities[index];

			// Recompute possible words for the slot, considering used words
			const pattern = getSlotPattern(slot);

			const possibleWords = [];
			findWordsForPattern(trieRoot, pattern, 0, "", possibleWords, usedWords, 100);
			if (possibleWords.length === 0) return false;

			// Sort possible words to try words with more common letters first (optional optimization)
			// possibleWords.sort((a, b) => /* your sorting logic */);

			for (const word of possibleWords) {
				if (canPlaceWord(word, slot)) {
					placeWord(word, slot);

					// Forward Checking: Update possible words for overlapping slots
					const backupPossibilities = [];
					let consistent = true;

					for (let k = index + 1; k < slotPossibilities.length; k++) {
						const { slot: nextSlot } = slotPossibilities[k];
						const nextPattern = getSlotPattern(nextSlot);
						const newPossibleWords = [];
						findWordsForPattern(trieRoot, nextPattern, 0, "", newPossibleWords, usedWords, 100);

						if (newPossibleWords.length === 0) {
							consistent = false;
							break;
						}

						backupPossibilities.push(slotPossibilities[k].possibleWords);
						slotPossibilities[k].possibleWords = newPossibleWords;
					}

					if (consistent && solve(index + 1)) return true;

					// Restore possible words
					for (let k = index + 1; k < slotPossibilities.length; k++) {
						slotPossibilities[k].possibleWords = backupPossibilities[k - index - 1];
					}

					removeWord(word, slot);
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
			console.log(`Attempt ${attempt} `);
			board = Array.from({ length: boardSize }, () => Array.from({ length: boardSize }, () => ({ pieceId: null, letter: null })));
			placedPieces = [];
			generateField();

			numberBoard = JSON.parse(JSON.stringify(board));

			const words = getWords(board);
			// console.log(words);

			const test = placeWords(board, words, trieRoot);
			if (test) {
				console.log("Final Board: ");
				printBoard(test);

				// console.log(convertBoardToPieces(test));

				console.log(new Date() - solverStartTime, "ms");
				return {
					pieces: convertBoardToPieces(test),
				};
			} else {
				console.log("Solver failed, regenerating field... ");
			}
		}
		console.error("Failed to generate a solvable level within the maximum attempts.");
	}

	return generateLevel();
}
