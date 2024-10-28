function getSpawningArea() {
    const boardElement = document.querySelector(".game-board");
    const boardRect = boardElement.getBoundingClientRect();

    const testingElement = document.querySelector(".testing-element");

    const leftOfBoard = {
        x: 10,
        y: boardRect.y - 15,
        width: boardRect.x - 20,
        height: boardRect.height
    }

    const rightOfBoard = {
        x: boardRect.x + boardRect.width + 10,
        y: boardRect.y - 15,
        width: window.innerWidth - (boardRect.x + boardRect.width) - 20,
        height: boardRect.height
    }

    const bottomOfBoard = {
        x: 10,
        y: boardRect.y + boardRect.height + 10,
        width: window.innerWidth - 20,
        height: window.innerHeight - (boardRect.y + boardRect.height) - 20
    }


    if (testingElement) {
        testingElement.style.left = `${bottomOfBoard.x}px`;
        testingElement.style.top = `${bottomOfBoard.y}px`;
        testingElement.style.width = `${bottomOfBoard.width}px`;
        testingElement.style.height = `${bottomOfBoard.height}px`;
    }

    return [
        leftOfBoard,
        rightOfBoard,
        bottomOfBoard
    ]
}

function doesItFit(piece, area, x, y) {
    const pieceRect = piece.element.getBoundingClientRect();
    const pieceWidth = pieceRect.width;
    const pieceHeight = pieceRect.height;

    if (x + pieceWidth > area.x + area.width || y + pieceHeight > area.y + area.height) {
        return false;
    }

    return true;
}

function doTheyOverlap(x1, y1, width1, height1, x2, y2, width2, height2) {
    return !((x1 + width1 < x2 || x2 + width2 < x1 || y1 + height1 < y2 || y2 + height2 < y1));
}

function doesItOverlap(x, y, width, height, pieces) {
    for (let i = 0; i < pieces.length; i++) {
        const otherPiece = pieces[i].element.getBoundingClientRect();

        if (doTheyOverlap(x, y, width, height, otherPiece.x, otherPiece.y, otherPiece.width, otherPiece.height)) {
            console.log("Overlap", x, y, width, height, otherPiece.x, otherPiece.y, otherPiece.width, otherPiece.height);
            return true;
        }
    }
    return false;
}

function getPiecesPostions(pieces) {
    console.log(pieces);
    const maxHeight = Math.max(...pieces.map(piece => piece.element.getBoundingClientRect().height));
    const maxWidth = Math.max(...pieces.map(piece => piece.element.getBoundingClientRect().width));


    const spawningArea = getSpawningArea().filter(area => area.width > maxWidth && area.height > maxHeight);
    console.log(spawningArea);

    let offX = 0;
    let offY = 0;
    let areaIndex = 0;

    console.log(maxHeight, maxWidth);

    for (let i = 0; i < pieces.length; i++) {
        const piece = pieces[i];
        const pieceElement = piece.element;
        const pieceRect = pieceElement.getBoundingClientRect();


        while (!doesItFit(piece, spawningArea[areaIndex], offX, offY) || doesItOverlap(spawningArea[areaIndex].x + offX, spawningArea[areaIndex].y + offY, pieceRect.width, pieceRect.height, pieces.slice(0, i))) {
            offX += 10;
            if (offX + pieceRect.width > spawningArea[areaIndex].x + spawningArea[areaIndex].width) {
                offX = 0;
                offY += 10;
                if (offY + pieceRect.height > spawningArea[areaIndex].y + spawningArea[areaIndex].height) {
                    offY = 0;
                    areaIndex++;
                    console.log(areaIndex)
                    if (areaIndex >= spawningArea.length) {
                        console.error("No more space for pieces");
                        offX = 0;
                        offY = 0;
                        areaIndex = 0;
                        break;
                    }
                }
            }
        }

        piece.moveWithOutAnimation(offX + spawningArea[areaIndex].x, offY + spawningArea[areaIndex].y);
        console.log("Placed", piece.type, "at", offX + spawningArea[areaIndex].x, offY + spawningArea[areaIndex].y, areaIndex);
        offX += pieceRect.width + 10;
        if (offX + pieceRect.width > spawningArea[areaIndex].x + spawningArea[areaIndex].width) {
            offX = 0;
            offY += pieceRect.height + 10;
            if (offY + piece.height > spawningArea[areaIndex].y + spawningArea[areaIndex].height) {
                offY = 0;
                areaIndex++;
            }
        }


    }
}