const levelPieces = generateLevel().pieces;
console.log(levelPieces);
const pieces = levelPieces.map((piece, ind) => new Piece(ind * 200, 100, piece));
