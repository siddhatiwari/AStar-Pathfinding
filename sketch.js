function removeFromArray(array, element) {
	for (let i = array.length - 1; i >= 0; i--) {
		if (array[i] == element) {
			array.splice(i, 1);
		}
	}
}

function heuristic(a, b) {
	return dist(a.i, a.j, b.i, b.j);
}

var cols = 50;
var rows = 50;
var grid = new Array(cols);

var openSet = [];
var closedSet = [];
var start;
var end;
var path = [];

var cellWidth, cellHeight;

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
		rect(this.i * cellWidth, this.j * cellWidth, 
			cellWidth - 1, cellHeight - 1);
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
					if (iTest >= 0 && iTest < cols &&
							jTest >= 0 && jTest < rows ) {
						this.neighbors.push(grid[iTest][jTest]);
					}
				}
			}
		}
	}
}

function setup() {
	createCanvas(800, 800);

	cellWidth = width / cols;
	cellHeight = height / rows;

	for (let i = 0; i < cols; i++) {
		grid[i] = new Array(cols);
		for (let j = 0; j < rows; j++) {
			grid[i][j] = new Cell(i, j);
		}
	}

	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j].addNeighbors();
		}
	}

	start = grid[0][0];
	end = grid[cols - 1][rows - 1];
	start.isWall = false;
	end.isWall = false;

	openSet.push(start);

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

				var betterPath = false;
				if (openSet.includes(neighbor)) {
					if (tempG < neighbor.g) {
						neighbor.g = tempG;
						betterPath = true;
					}
				} else {
					neighbor.g = tempG;
					betterPath = true;
					openSet.push(neighbor);
				}

				if (betterPath) {
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
		console.log('no solution');
		noLoop();
		return;
	}

	background(0);

	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j].show(color(255));
		}
	}

	for (let i = 0; i < closedSet.length; i++) {
		closedSet[i].show(color(255, 0, 0));
	}

	for (let i = 0; i < openSet.length; i++) {
		openSet[i].show(color(0, 255, 0));
	}

	path = [];
	let temp = currentCell;
	while(temp.previous) {
		path.push(temp);
		temp = temp.previous;
	}

	for (let i = 0; i < path.length; i++) {
		path[i].show(color(0, 0, 255));
	}
 
}
