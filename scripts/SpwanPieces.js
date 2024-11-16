function getSpawningArea() {
    const boardElement = document.querySelector(".game-board");
    const boardRect = boardElement.getBoundingClientRect();
    const viewportWidth = window.visualViewport?.width || window.innerWidth;
    const viewportHeight = window.visualViewport?.height || window.innerHeight;

    const leftOfBoard = {
        x: 10,
        y: Math.max(boardRect.y - 15, 0),
        width: Math.max(boardRect.x - 20, 0),
        height: Math.min(boardRect.height, viewportHeight)
    };

    const rightOfBoard = {
        x: Math.min(boardRect.x + boardRect.width + 10, viewportWidth),
        y: Math.max(boardRect.y - 15, 0),
        width: Math.max(viewportWidth - (boardRect.x + boardRect.width) - 20, 0),
        height: Math.min(boardRect.height, viewportHeight)
    };

    const bottomOfBoard = {
        x: 10,
        y: Math.min(boardRect.y + boardRect.height + 10, viewportHeight),
        width: Math.max(viewportWidth - 20, 0),
        height: Math.max(viewportHeight - (boardRect.y + boardRect.height) - 20, 0)
    };

    return [leftOfBoard, rightOfBoard, bottomOfBoard];
}

function isFullyVisibleOnScreen(piece, x, y) {
    const pieceRect = piece.element.getBoundingClientRect();
    const viewportWidth = window.visualViewport?.width || window.innerWidth;
    const viewportHeight = window.visualViewport?.height || window.innerHeight;

    return (
        x >= 0 &&
        y >= 0 &&
        x + pieceRect.width <= viewportWidth &&
        y + pieceRect.height <= viewportHeight
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
    const randomX = Math.floor(Math.random() * (area.width - pieceRect.width)) + area.x;
    const randomY = Math.floor(Math.random() * (area.height - pieceRect.height)) + area.y;

    return { x: randomX, y: randomY };
}

function spawnPiecesRandomly(pieces) {
    const spawningAreas = getSpawningArea();

    for (const piece of pieces) {
        const pieceRect = piece.element.getBoundingClientRect();

        const area = spawningAreas.find(area =>
            area.width >= pieceRect.width && area.height >= pieceRect.height
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

        piece.moveWithOutAnimation(position.x, position.y);
        piece.setStartingPosition(position.x, position.y);
    }
}

function getPiecesPostions(pieces) {
    spawnPiecesRandomly(pieces);
    return pieces.map(piece => {
        const pieceRect = piece.element.getBoundingClientRect();
        return {
            x: Math.round(pieceRect.x),
            y: Math.round(pieceRect.y),
            width: Math.round(pieceRect.width),
            height: Math.round(pieceRect.height)
        };
    });
}
