
var threeD = true;

var yUnits = 10;
var xUnits = 10;
var zUnits = 10;

var openSet = [];
var closedSet = [];
var start;
var end;
var path = [];
var rotation = 0;

var ended = false;

var cellSide;

function removeFromArray(array, element) {
	for (let i = array.length - 1; i >= 0; i--) {
		if (array[i] == element) {
			array.splice(i, 1);
		}
	}
}

function heuristic(a, b) {

	// return 0; Dijstra's

	if (!threeD)
		return dist(a.i, a.j, b.i, b.j);
	else {
		let v1 = createVector(a.i, a.j, a.k);
		let v2 = createVector(b.i, b.j, b.k);
		return v1.dist(v2);
	}

}

function calculatePath(cell, newPath = []) {
	if (cell.previous) {
		newPath.push(cell.previous);
		return calculatePath(cell.previous, newPath);
	}
	else
		return newPath;
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

	if (random(1) < 0.4) {
		this.isWall = true;
	}

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

function setup2D() {
	cellSide = width / xUnits;

	let cells = 0;
	grid = new Array(xUnits);
	for (let i = 0; i < xUnits; i++) {
		grid[i] = new Array(yUnits);
		for (let j = 0; j < yUnits; j++) {
			cells++;
			grid[i][j] = new Cell(i, j);
		}
	}
	console.log(cells);

	for (let i = 0; i < xUnits; i++) {
		for (let j = 0; j < yUnits; j++) {
			grid[i][j].addNeighbors();
		}
	}

	start = grid[0][0];
	end = grid[xUnits - 1][yUnits - 1];
	start.isWall = false;
	end.isWall = false;

	openSet.push(start);

}

function threeDCell(i, j, k) {
	this.i = i;
	this.j = j;
	this.k = k;
	this.f = 0;
	this.g = 0;
	this.h = 0;
	this.neighbors = [];
	this.previous = undefined;
	this.isWall = false;

	if (random(1) < 0.6) {
		this.isWall = true;
	}

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

function setup3D() {
	cellSide = 600 / xUnits;

	grid = new Array(xUnits);
	for (let i = 0; i < xUnits; i++) {
		grid[i] = new Array(yUnits);
		for (let j = 0; j < yUnits; j++) {
			grid[i][j] = new Array(zUnits);
			for (let k = 0; k < zUnits; k++) {
				grid[i][j][k] = new threeDCell(i, j, k);
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

	start = grid[0][0][0];
	end = grid[xUnits - 1][yUnits - 1][zUnits - 1];
	start.isWall = false;
	end.isWall = false;

	openSet.push(start);

}

function setup() {
	if (!threeD)
		createCanvas(2500, 2500);
	else 
		createCanvas(2500, 2500, WEBGL);
	fill(0,0,0,0); 

	if (!threeD)
		setup2D();
	else 
		setup3D();

}

function draw2D(currentCell) {
	for (let i = 0; i < yUnits; i++) {
		for (let j = 0; j < xUnits; j++) {
			grid[i][j].show(color(255));
		}
	}

	for (let i = 0; i < closedSet.length; i++) {
		closedSet[i].show(color(255, 0, 0));
	}

	for (let i = 0; i < openSet.length; i++) {
		openSet[i].show(color(0, 255, 0));
	}

	path = calculatePath(currentCell);

	for (let i = 0; i < path.length; i++) {
		path[i].show(color(0, 0, 255));
	}
}

function draw3D(currentCell) {

	rotation = rotation + 0.025;

	for (let i = 0; i < yUnits; i++) {
		for (let j = 0; j < xUnits; j++) {
			for (let k = 0; k < zUnits; k++) {
				grid[i][j][k].show(color(255, 255, 255, 0));
			}
		}
	}

	for (let i = 0; i < closedSet.length; i++) {
		closedSet[i].show(color(255, 0, 0, 50));
	}

	for (let i = 0; i < openSet.length; i++) {
		openSet[i].show(color(0, 255, 0, 20));
	}

	path = calculatePath(currentCell);

	for (let i = 0; i < path.length; i++) {
		path[i].show(color(0, 0, 255, 175));
	}
}

function draw() {

	if (openSet.length > 0) {

		let lowestIndex = 0;
		for (let i = 0; i < openSet.length; i++) {
			if (openSet[i].f < openSet[lowestIndex].f) {
				lowestIndex = i;
			}
		}
		var currentCell = openSet[lowestIndex];

		if (currentCell === end) {
			noLoop();
			console.log("DONE");
		}

		let neighbors = currentCell.neighbors;
		for (let i = 0; i < neighbors.length; i++) {
			let neighbor = neighbors[i];

			if (!closedSet.includes(neighbor) && !neighbor.isWall) {
				let tempG = currentCell.g + 1;

				var isBetterPath = false;
				if (openSet.includes(neighbor)) {
					if (tempG < neighbor.g) {
						neighbor.g = tempG;
						betterPath = true;
					}
				} else {
					neighbor.g = tempG;
					isBetterPath = true;
					openSet.push(neighbor);
				}

				if (isBetterPath) {
					neighbor.previous = currentCell;
					neighbor.h = heuristic(neighbor, end);
					neighbor.f = neighbor.g + neighbor.h;
				}
			}

			neighbor.g = currentCell.g + 1;
		}

		removeFromArray(openSet, currentCell);
		closedSet.push(currentCell);

	} else {
		noLoop();
		console.log('no solution');
		return;
	}

	background(255, 255, 255);

	if (!threeD)
		draw2D(currentCell);
	else 
		draw3D(currentCell);
 
}
