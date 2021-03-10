//Server
const url = '#here was the url';
var difficulty = 'normal';
var getWidth;
var getHeight;
var gameid;
var sideOut;
var positionOut;
var side = this.side;
var position = this.position;
var atoms = [];
var correct;
var atomsList;
var solution;

//testing
//setTimeout(function() {console.log('side: ' + sideOut);}, 10000);
//setTimeout(function() {console.log('pos: ' + positionOut);}, 10000);
//setTimeout(function() {console.log('gameid: ' + gameid);}, 10000);
//setTimeout(function() {console.log('atoms: ' + atoms);}, 10000);

const newgame = () => {
	axios
		.get(url + '?request=newgame&difficulty=' + difficulty)
		.then(function(response) {
			// handle success
			var data = response.data;
			//console.log(data);
			return data;
		})
		.catch(function(error) {
			// handle error
			console.log(error);
		})
		.then(function(data) {
			// always executed
			this.getWidth = data.width;
			this.getHeight = data.height;
			this.gameid = data.gameid;
			return getWidth, getHeight, gameid;
		})
		.then(function() {
			const output = document.getElementById('output');
			output.innerText = ' ';
			AtomGame.start();
		});
};

const solve = () => {
	axios
		.get(url + '?request=solve&gameid=' + gameid + '&atoms=' + JSON.stringify(atoms))
		.then(function(response) {
			// handle success
			var data = response.data;
			//console.log(response);
			return data;
		})
		.catch(function(error) {
			// handle error
			console.log(error);
		})
		.then(function(data) {
			// always executed
			this.correct = data.correct;
			this.atomsList = data.atoms;
			this.solution = data.solution;
			return correct, atomsList, solution;
		})
		.then(function() {
			const output = document.getElementById('output');

			if (correct == true) {
				output.innerText = 'YOU WIN!';
				output.style.color = 'green';
			} else {
				output.innerText = 'YOU LOSE! \n The solution is: ' + solution;
				output.style.color = 'red';
			}
		});
};

//setTimeout(function() { console.log('checkWidth:' +getWidth) }, 5000);

const shoot = () => {
	axios
		.get(url + '?request=shoot&gameid=' + gameid + '&side=' + side + '&position=' + position)
		.then(function(response) {
			// handle success
			var data = response.data;
			//console.log(response);
			return data;
		})
		.catch(function(error) {
			// handle error
			console.log(error);
		})
		.then(function(data) {
			// always executed
			this.sideOut = data.side;
			this.positionOut = data.position;
			return sideOut, positionOut;
		})
		.then(function() {
			AtomGame.ArrowsOut(sideOut, positionOut, side, position);
		});
};

//console.log('WIDTH:		'+getWidth);
//console.log('HEIGHT:		'+getHeight);

//game
window.addEventListener('load', function() {
	const output = document.getElementById('output');
	output.innerText = 'Press Play, to start the game!';

	document.getElementById('play').addEventListener('click', newgame);
	document.getElementById('solve').addEventListener('click', solve);

	addEventListener('click', shoot);
});

const AtomGame = {
	board: [],
	hmtlBoard: [],

	width: 7,
	height: 7,

	start() {
		//	this.BoardSize();
		this.setParameters();
		this.board = this.buildBoard();
		this.htmlBoard = this.buildBoard();
		this.buildHtmlBoard();
		this.sides();
		this.corner();
		this.setAtoms();
		this.BoardCellSize();
	},

	ArrowsOut(sideOut, positionOut, side, position) {
		if (sideOut == 'bottom') {
			if (sideOut == side && positionOut == position) {
				this.setField(positionOut, this.height - 1, 'pfeil-OU');
			} else {
				this.setField(positionOut, this.height - 1, 'pfeil-U');
			}
		}

		if (sideOut == 'top') {
			if (sideOut == side && positionOut == position) {
				this.setField(positionOut, 0, 'pfeil-OU');
			} else {
				this.setField(positionOut, 0, 'pfeil-O');
			}
		}
		if (sideOut == 'left') {
			if (sideOut == side && positionOut == position) {
				this.setField(0, positionOut, 'pfeil-LR');
			} else {
				this.setField(0, positionOut, 'pfeil-L');
			}
		}
		if (sideOut == 'right') {
			if (sideOut == side && positionOut == position) {
				this.setField(this.width - 1, positionOut, 'pfeil-LR');
			} else {
				this.setField(this.width - 1, positionOut, 'pfeil-R');
			}
		}
	},

	setParameters() {
		this.width = getWidth;
		this.height = getHeight;
		return this.width, this.height;
	},

	BoardCellSize() {
		const field = document.getElementsByClassName('field');
		const sizeProzent2 = 100 / this.width;
		for (let x = 0; x < field.length; x++) {
			field[x].style.width = sizeProzent2 + '%';
			field[x].style.height = sizeProzent2 + '%';
		}
	},

	//
	buildBoard() {
		const board = [];
		for (let y = 0; y < this.width; y++) {
			board.push([]);
			for (let x = 0; x < this.height; x++) board[y].push('   ');
		}
		return board;
	},

	//
	buildHtmlBoard() {
		const divBoard = document.querySelector('#board');
		divBoard.innerHTML = ' ';

		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				let field = document.createElement('div');

				field.classList.add('field');
				field.setAttribute('data-x', x);
				field.setAttribute('data-y', y);

				field.addEventListener('click', (event) => this.onClick(event));
				divBoard.appendChild(field);
				this.htmlBoard[x][y] = field;
			}
		}
	},
	//base
	clearArrow() {
		let green = document.getElementsByClassName('field sideField');
		let white = document.getElementsByClassName('field whiteField');
		var whiteLength = white.length;
		var length = green.length;
		for (let z = 0; z < length; z++) {
			green[z].className = 'field sideField';
		}

		for (let j = 0; j < whiteLength; j++) {
			white[j].className = 'field whiteField';
		}
	},

	//
	reset() {
		const field = document.getElementsByClassName('field');
		const output = document.getElementById('output');
		const fieldLength = field.length;
		field[0].remove();
		output.innerText = '';
		this.start();
	},

	corner() {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				if (
					(x == 0 && y == 0) ||
					(x == this.width - 1 && y == 0) ||
					(x == 0 && y == this.height - 1) ||
					(x == this.width - 1 && y == this.height - 1)
				) {
					this.board[x][y] = 'whiteField';
					this.htmlBoard[x][y].classList.add('whiteField');
				}
			}
		}
	},

	sides() {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				if (
					(y > 0 && y < this.height - 1 && x == 0) ||
					(y > 0 && y < this.height - 1 && x == this.width - 1) ||
					(x > 0 && x < this.width - 1 && y == 0) ||
					(x > 0 && x < this.width - 1 && y == this.height - 1)
				) {
					this.board[x][y] = 'sideField';
					this.htmlBoard[x][y].classList.add('sideField');
				}
			}
		}
	},

	//
	setAtoms() {
		for (let n = 0; n < 5; n++) {
			let x = Math.floor(Math.random() * (this.width - 4)) + 2;
			let y = Math.floor(Math.random() * (this.height - 4)) + 2;
			let atomTouch = false;

			//CHECK IF ATOMS TOUCH
			for (let k = y - 1; k <= y + 1; k++) {
				for (let z = x - 1; z <= x + 1; z++) {
					if (this.htmlBoard[z][k].classList.contains('kugel')) {
						//kugel durch atom ersetzen
						atomTouch = true;
						break;
					}
				}
			}
			if (atomTouch === false) {
				this.setField(x, y, 'kugel'); //kugel durch atom ersetzen
			}
		}
	},

	onClick(event) {
		const clickedField = event.target;
		const x = clickedField.getAttribute('data-x');
		const y = clickedField.getAttribute('data-y');

		var timeOut = window.setTimeout(this.clearArrow, 3000);
		this.side(x, y);
		//this.Arrows(x, y);
		this.ArrowsServer(x, y);

		this.setAtomField(x, y);
		this.atomPos();

		//	alert("geklickt:" + x + "/" + y);

		for (let w = timeOut; w <= 0; w--) {
			window.clearTimeout(w);
		}
	},

	setField(x, y, val) {
		this.board[x][y] = val;
		this.htmlBoard[x][y].classList.add(val);
	},

	side(x, y) {
		if (x == 0 && (y > 0 && y < this.height - 1)) {
			side = 'left';
			position = y;
		}
		if (x == this.width - 1 && (y > 0 && y < this.height - 1)) {
			side = 'right';
			position = y;
		}
		if (y == 0 && (x > 0 && x < this.width - 1)) {
			side = 'top';
			position = x;
		}
		if (y == this.height - 1 && (x > 0 && x < this.width - 1)) {
			side = 'bottom';
			position = x;
		}
		//console.log(position);
		return side, position;
	},

	ArrowsServer(x, y) {
		if (y == this.height - 1 && x > 0 && x < this.width - 1) {
			this.setField(x, y, 'pfeil-O');
			window.shoot;
		}
		if (x == 0 && y > 0 && y < this.height - 1) {
			this.setField(x, y, 'pfeil-R');
			window.shoot;
		}
		if (x == this.width - 1 && y > 0 && y < this.height - 1) {
			this.setField(x, y, 'pfeil-L');
			window.shoot;
		}
		if (y == 0 && x > 0 && x < this.width - 1) {
			this.setField(x, y, 'pfeil-U');
			window.shoot;
		}
	},

	setAtomField(x, y) {
		if (y > 0 && y < this.height - 1 && x > 0 && x < this.width - 1) {
			if (this.htmlBoard[x][y].classList.contains('atom') === false) {
				this.setField(x, y, 'atom');
			} else if (this.htmlBoard[x][y].classList.contains('atom') === true) {
				this.htmlBoard[x][y].classList.remove('atom');

				//console.log('testttt');
			}
		}
		return atoms;
	},

	atomPos() {
		atoms = [];
		for (let k = 0; k < this.width; k++) {
			for (let z = 0; z < this.height; z++) {
				if (this.htmlBoard[k][z].classList.contains('atom')) {
					atoms.push([ k, z ]);
				}
			}
		}
		return atoms;
	}
};
