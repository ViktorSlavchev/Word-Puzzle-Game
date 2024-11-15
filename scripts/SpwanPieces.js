function getSpawningArea() {
    const boardElement = document.querySelector(".game-board");
    const boardRect = boardElement.getBoundingClientRect();

    const leftOfBoard = {
        x: 10,
        y: boardRect.y - 15,
        width: boardRect.x - 20,
        height: boardRect.height
    };

    const rightOfBoard = {
        x: boardRect.x + boardRect.width + 10,
        y: boardRect.y - 15,
        width: window.innerWidth - (boardRect.x + boardRect.width) - 20,
        height: boardRect.height
    };

    const bottomOfBoard = {
        x: 10,
        y: boardRect.y + boardRect.height + 10,
        width: window.innerWidth - 20,
        height: window.innerHeight - (boardRect.y + boardRect.height) - 20
    };

    return [leftOfBoard, rightOfBoard, bottomOfBoard];
}

function isFullyVisibleOnScreen(piece, x, y) {
    const pieceRect = piece.element.getBoundingClientRect();
    return (
        x >= 0 &&
        y >= 0 &&
        x + pieceRect.width <= window.innerWidth &&
        y + pieceRect.height <= window.innerHeight
    );
}

function doesItFit(piece, area, x, y) {
    const pieceRect = piece.element.getBoundingClientRect();
    return (
        x >= area.x &&
        y >= area.y &&
        x + pieceRect.width <= area.x + area.width &&
        y + pieceRect.height <= area.y + area.height &&
        isFullyVisibleOnScreen(piece, x, y)
    );
}

function getRandomPosition(area, piece) {
    const pieceRect = piece.getBoundingClientRect();

    // Generate a random position within the area.
    const randomX = Math.random() * (area.width - pieceRect.width) + area.x;
    const randomY = Math.random() * (area.height - pieceRect.height) + area.y;

    return { x: randomX, y: randomY };
}

function spawnPiecesRandomly(pieces) {
    const spawningAreas = getSpawningArea();

    for (const piece of pieces) {
        console.log(piece);

        // Find an area that can fit the piece.
        const area = spawningAreas.sort(() => Math.random() - 0.5).find(area =>
            area.width >= piece.element.getBoundingClientRect().width &&
            area.height >= piece.element.getBoundingClientRect().height
        );

        if (!area) {
            console.error("No suitable area found for piece:", piece);
            continue;
        }

        let position;
        let attempts = 0;
        do {
            position = getRandomPosition(area, piece.element);
            attempts++;
        } while (!doesItFit(piece, area, position.x, position.y) && attempts < 100);

        if (attempts >= 100) {
            console.error("Failed to place piece:", piece);
            continue;
        }

        console.log(piece)
        piece.moveWithOutAnimation(position.x, position.y);
        piece.setStartingPosition(position.x, position.y);
    }
}
function getPiecesPostions(pieces) {
    spawnPiecesRandomly(pieces);
    return pieces.map(piece => {
        const pieceRect = piece.element.getBoundingClientRect();
        return {
            x: pieceRect.x,
            y: pieceRect.y,
            width: pieceRect.width,
            height: pieceRect.height
        };
    });
}
