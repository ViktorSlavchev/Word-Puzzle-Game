const parent = document.querySelector(".game-holder");

class Piece {
	constructor(x, y, content) {
		this.x = x;
		this.y = y;
		this.bricks = content.blocks;
		this.type = content.name;
		this.className = content.name
			.replace(/[A-Z]/g, (match) => `-${match}`)
			.toLowerCase()
			.slice(1);

		this.element = this.generateElement();

		this.isPlaced = false;
		this.boardPosition = null;

		this.width = Math.max(...this.bricks.map((block) => block.x));
		this.height = Math.max(...this.bricks.map((block) => block.y));
	}

	generateElement() {
		const element = document.createElement("div");
		element.classList.add("piece");
		element.classList.add(this.className);
		element.style.left = `${this.x}px`;
		element.style.top = `${this.y}px`;

		const lowestX = Math.min(...this.bricks.map((block) => block.x));
		const lowestY = Math.min(...this.bricks.map((block) => block.y));

		for (let i = 0; i < this.bricks.length; i++) {
			const block = this.bricks[i];
			const div = document.createElement("div");
			div.classList.add("block");
			div.style.gridColumn = block.x - lowestX + 1;
			div.style.gridRow = block.y - lowestY + 1;

			div.textContent = block.letter.toUpperCase();
			element.appendChild(div);
		}

		parent.appendChild(element);

		return element;
	}

	move(x, y) {
		this.x = x;
		this.y = y;


		requestAnimationFrame(function () {
			this.element.style.left = `${this.x}px`;
			this.element.style.top = `${this.y}px`;
		}.bind(this));
	}

	moveWithOutAnimation(x, y) {
		this.element.style.transition = "none";
		this.x = x;
		this.y = y;
		this.element.style.left = `${x}px`;
		this.element.style.top = `${y}px`;

		setTimeout(() => {
			this.element.style.transition = "top 0.1s, left 0.1s";
		}, 50);
	}

	setStartingPosition(x, y) {
		this.startingX = x;
		this.startingY = y;
	}
	resetPosition() {
		this.move(this.startingX, this.startingY);
	}
}
