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
		console.log(this.className, content.name);

		this.element = this.generateElement();
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

		this.element.style.left = `${x}px`;
		this.element.style.top = `${y}px`;
	}
}
