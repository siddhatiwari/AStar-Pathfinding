
const WALL_PROBABILITY = 0.33;
const xUnits = 15;
const yUnits = 3;
const zUnits = 15;

let pathFinding = new AStar3D();

function setup() {
	pathFinding.setup(2000, 2000);
}

function draw() {
	pathFinding.draw();
}

function removeFromArray(array, element) {
	for (let i = array.length - 1; i >= 0; i--) {
		if (array[i] == element) {
			array.splice(i, 1);
		}
	}
}

function AStar() {

	this.grid = null;
	this.openSet = [];
	this.closedSet = [];
	this.path = [];
	this.start;
	this.end;

	this.calculatePath = function(cell, newPath = []) {
		if (cell.previous) {
			newPath.push(cell.previous);
			return this.calculatePath(cell.previous, newPath);
		}
		else
			return newPath;
	}

	this.calculate = function() {
		if (this.openSet.length > 0) {
			let lowestIndex = 0;
			for (let i = 0; i < this.openSet.length; i++) {
				if (this.openSet[i].f < this.openSet[lowestIndex].f) {
					lowestIndex = i;
				}
			}
			let currentCell = this.openSet[lowestIndex];

			this.path = this.calculatePath(currentCell);
			if (currentCell === this.end)
				this.path.push(currentCell);

			if (currentCell === this.end) {
				noLoop();
				console.log("DONE");
			}

			let neighbors = currentCell.neighbors;
			for (let i = 0; i < neighbors.length; i++) {
				let neighbor = neighbors[i];

				if (!this.closedSet.includes(neighbor) && !neighbor.isWall) {
					let tempG = currentCell.g + 1;

					let isBetterPath = false;
					if (this.openSet.includes(neighbor)) {
						if (tempG < neighbor.g) {
							neighbor.g = tempG;
							betterPath = true;
						}
					} else {
						neighbor.g = tempG;
						isBetterPath = true;
						this.openSet.push(neighbor);
					}

					if (isBetterPath) {
						neighbor.previous = currentCell;
						neighbor.h = this.heuristic(neighbor, this.end);
						neighbor.f = neighbor.g + neighbor.h;
					}
				}

				neighbor.g = currentCell.g + 1;
			}

			removeFromArray(this.openSet, currentCell);
			this.closedSet.push(currentCell);

		} else {
			noLoop();
			console.log('no solution');
			return;
		}

	}

}

function Cell(i, j) {
	this.i = i;
	this.j = j;
	this.f = 0;
	this.g = 0;
	this.h = 0;
	this.neighbors = [];
	this.previous = undefined;
	this.isWall = false;

	if (random(1) < WALL_PROBABILITY) {
		this.isWall = true;
	}
}

function AStar2D() {

	AStar.call(this);

	function Cell2D(i, j) {

		Cell.call(this, i, j);

		this.show = function(color) {
			if (this.isWall)
				fill(0);
			else
				fill(color);

			noStroke();
			rect(this.i * cellSide, this.j * cellSide, 
					 cellSide - 1, cellSide - 1);
		}

		this.addNeighbors = function() {
			let shifts = [-1, 0, 1];
			for (n in shifts) {
				for (p in shifts) {
					let iShift = shifts[n]
					let jShift = shifts[p]
					if (!(iShift == 0 && jShift == 0)) {
						let iTest = this.i + iShift;
						let jTest = this.j + jShift;
						if (iTest >= 0 && iTest < xUnits &&
								jTest >= 0 && jTest < yUnits) {
							this.neighbors.push(grid[iTest][jTest]);
						}
					}
				}
			}
		}
	}

	Cell2D.prototype = Object.create(Cell.prototype);

	this.setup = function(canvasWidth, canvasHeight) {
		createCanvas(canvasWidth, canvasHeight);
		cellSide = width / xUnits;

		grid = new Array(xUnits);
		for (let i = 0; i < xUnits; i++) {
			grid[i] = new Array(yUnits);
			for (let j = 0; j < yUnits; j++) {
				grid[i][j] = new Cell2D(i, j);
			}
		}

		for (let i = 0; i < xUnits; i++) {
			for (let j = 0; j < yUnits; j++) {
				grid[i][j].addNeighbors();
			}
		}

		this.start = grid[0][0];
		this.end = grid[xUnits - 2][yUnits - 2];
		this.start.isWall = false;
		this.end.isWall = false;

		this.openSet.push(this.start);
	}

	this.heuristic = function(a, b) {
		return dist(a.i, a.j, b.i, b.j);
	}

	this.draw = function() {
		background(0);

		this.calculate();
		for (let i = 0; i < xUnits; i++) {
			for (let j = 0; j < yUnits; j++) {
				grid[i][j].show(color(255));
			}
		}
		for (let i = 0; i < this.closedSet.length; i++)
			this.closedSet[i].show(color(255, 0, 0));
		for (let i = 0; i < this.openSet.length; i++)
			this.openSet[i].show(color(0, 255, 0));
		for (let i = 0; i < this.path.length; i++)
			this.path[i].show(color(0, 0, 255));
		this.start.show(color(255, 255, 0));
		this.end.show(color(204, 51, 255));
	}
}

AStar2D.prototype = Object.create(AStar.prototype);

function AStar3D() {

	AStar.call(this);

	let rotation = 0;

	function Cell3D(i, j, k) {

		Cell.call(this, i, j);

		this.k = k;

		this.show = function(color) {
			if (this.isWall)
				fill(0, 0, 0, 100);
			else
				fill(color);

			noStroke();
			push();
			rotateX(rotation);
			rotateY(rotation);
			rotateZ(rotation);
			translate(this.i * cellSide, this.j * cellSide,
								this.k * cellSide);
			box(cellSide);
			pop();
		}

		this.addNeighbors = function() {
			let shifts = [-1, 0, 1];
			for (x in shifts) {
				for (y in shifts) {
					for (z in shifts) {
						let iShift = shifts[x];
						let jShift = shifts[y];
						let kShift = shifts[z];
						if (!(iShift == 0 && jShift == 0 && kShift == 0)) {
							let iTest = this.i + iShift;
							let jTest = this.j + jShift;
							let kTest = this.k + kShift;
							if (iTest >= 0 && iTest < xUnits &&
									jTest >= 0 && jTest < yUnits &&
									kTest >= 0 && kTest < zUnits) {
								this.neighbors.push(grid[iTest][jTest][kTest]);
							}	
						}
					}
				}
			}
		}

	}

	Cell3D.prototype = Object.create(Cell.prototype);

	this.setup = function(canvasWidth, canvasHeight) {
		createCanvas(canvasWidth, canvasHeight, WEBGL);
		cellSide = 600 / xUnits;

		grid = new Array(xUnits);
		for (let i = 0; i < xUnits; i++) {
			grid[i] = new Array(yUnits);
			for (let j = 0; j < yUnits; j++) {
				grid[i][j] = new Array(zUnits);
				for (let k = 0; k < zUnits; k++) {
					grid[i][j][k] = new Cell3D(i, j, k);
				}
			}
		}

		for (let i = 0; i < xUnits; i++) {
			for (let j = 0; j < yUnits; j++) {
				for (let k = 0; k < zUnits; k++) {
					grid[i][j][k].addNeighbors();
				}
			}
		}

		this.start = grid[0][0][0];
		this.end = grid[xUnits - 2][yUnits - 2][zUnits - 2];
		this.start.isWall = false;
		this.end.isWall = false;

		this.openSet.push(this.start);
	}

	this.heuristic = function(a, b) {
		let v1 = createVector(a.i, a.j, a.k);
		let v2 = createVector(b.i, b.j, b.k);
		return v1.dist(v2);
	}

	this.draw = function() {
		background(255);

		rotation += 0.05;
		this.calculate();
		for (let i = 0; i < xUnits; i++) {
			for (let j = 0; j < yUnits; j++) {
				for (let k = 0; k < zUnits; k++) {
					grid[i][j][k].show(color(255, 255, 255, 0));
				}
			}
		}
		for (let i = 0; i < this.closedSet.length; i++)
			this.closedSet[i].show(color(255, 0, 0, 50));
		for (let i = 0; i < this.openSet.length; i++)
			this.openSet[i].show(color(0, 255, 0, 20));
		for (let i = 0; i < this.path.length; i++)
			this.path[i].show(color(0, 0, 255, 175));
		this.start.show(color(255, 255, 0, 175));
		this.end.show(color(204, 51, 255, 175));
		}

}

AStar3D.prototype = Object.create(AStar.prototype);
