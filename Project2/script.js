window.addEventListener('load', function() {
	AtomGame.start();
	document.getElementById('play').addEventListener('click', function() {
		AtomGame.reset();
	});

	document.getElementById('solve').addEventListener('click', function() {
		var won = AtomGame.checkWin();

		const output = document.getElementById('output');

		if (won == true) {
			output.innerText = 'YOU WIN!';
		} else {
			 output.innerText = 'YOU LOSE!';
	
		}
	});
});

const AtomGame = {
	board: [],
	hmtlBoard: [],
	size: 8,

	start() {
		this.BoardSize();
		this.board = this.buildBoard();
		this.htmlBoard = this.buildBoard();
		this.buildHtmlBoard();

		this.sides();
		this.BoardCellSize();
		this.setAtoms();
	},

	//
	BoardSize() {
		this.size = Math.floor(Math.random() * 3) + 7;
	},
	//
	BoardCellSize() {
		const field = document.getElementsByClassName('field');
		const sizeProzent = 100 / this.size;
		for (let x = 0; x < field.length; x++) {
			field[x].style.width = sizeProzent + '%';
			field[x].style.height = sizeProzent + '%';
		}
	},

	//
	buildBoard() {
		const board = [];
		for (let y = 0; y < this.size; y++) {
			board.push([]);
			for (let x = 0; x < this.size; x++) board[y].push('   ');
		}
		return board;
	},

	//
	buildHtmlBoard() {
		const divBoard = document.querySelector('#board');
		divBoard.innerHTML = ' ';

		for (let y = 0; y < this.size; y++) {
			for (let x = 0; x < this.size; x++) {
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
		var length = green.length;
		for (let z = 0; z < length; z++) {
			green[z].className = 'field sideField';
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

	sides() {
		for (let y = 0; y < this.size; y++) {
			for (let x = 0; x < this.size; x++) {
				if (x == y || (x === 0 && y === this.size - 1) || (y === 0 && x === this.size - 1)) {
					continue;
				}
				if (y == 0 || x == 0 || y == this.size - 1 || x == this.size - 1) {
					this.board[x][y] = 'sideField';
					this.htmlBoard[x][y].classList.add('sideField');
				}
			}
		}
	},
	//
	setAtoms() {
		for (let n = 0; n < 5; n++) {
			let x = Math.floor(Math.random() * (this.size - 4)) + 2;
			let y = Math.floor(Math.random() * (this.size - 4)) + 2;
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
		

		this.Arrows(x, y);

		this.setAtomField(x, y);

		//alert("geklickt:" + x + "/" + y);

		for (let w = timeOut; w <= 0; w--) {
			window.clearTimeout(w);
		}
	},

	setField(x, y, val) {
		this.board[x][y] = val;
		this.htmlBoard[x][y].classList.add(val);
	},

	Arrows(x, y) {
		var col = parseInt(x) + 1; //links
		var colR = parseInt(x) - 1; //rechts
		var row = parseInt(y) + 1;
		var rowR = parseInt(y) - 1;

		//schuss nach oben
		if (this.board[x][y] !== ' ' && y == this.size - 1 && x > 0 && x < this.size - 1) {
			for (let z = this.size - 1; z > 1; z--) {
				if (this.htmlBoard[x][z].classList.contains('kugel')) {
					//kugel durch atom ersetzen
					this.setField(x, y, 'pfeil-OU');
					this.htmlBoard[x][0].classList.remove('pfeil-O');

					break;
				}
				if (this.htmlBoard[x][z].classList.contains('kugel') === false) {
					if (
						this.htmlBoard[col][z].classList.contains('kugel') &&
						this.htmlBoard[colR][z].classList.contains('kugel') !==
							this.htmlBoard[col][z].classList.contains('kugel')
					) {
						// if(atom eine spalte weiter)-->pfeil Links
						this.setField(0, z + 1, 'pfeil-L');
						this.htmlBoard[x][0].classList.remove('pfeil-O');
						break;
					} else if (
						this.htmlBoard[colR][z].classList.contains('kugel') &&
						this.htmlBoard[colR][z].classList.contains('kugel') !==
							this.htmlBoard[col][z].classList.contains('kugel')
					) {
						this.setField(this.size - 1, z + 1, 'pfeil-R');
						this.htmlBoard[x][0].classList.remove('pfeil-O');
						break;
					}
					for (let n = this.size - 1; n > 1; n--) {
						for (let j = col + 1; j < this.size - 1; j++) {
							if (
								this.htmlBoard[colR][n].classList.contains('kugel') === true &&
								this.htmlBoard[j][n].classList.contains('kugel') === true
							) {
								console.log('colR	:' + colR);
								console.log('j	:' + j);
								this.setField(x, y, 'pfeil-O');
								this.setField(j - 1, y, 'pfeil-U');
								this.htmlBoard[this.size][n - 1].classList.remove('pfeil-R');
							}
						}
					}

					for (let n = this.size - 1; n > 1; n--) {
						for (let j = colR - 1; j > 0; j--) {
							if (
								this.htmlBoard[col][n].classList.contains('kugel') === true &&
								this.htmlBoard[j][n].classList.contains('kugel') === true
							) {
								console.log('colR	:' + colR);
								console.log('j	:' + j);
								this.setField(x, y, 'pfeil-O');
								this.setField(j + 1, y, 'pfeil-U');
								this.htmlBoard[0].classList.remove('pfeil-L');
							}
						}
					}

					if (
						this.htmlBoard[colR][z].classList.contains('kugel') === true &&
						this.htmlBoard[col][z].classList.contains('kugel') === true
					) {
						this.setField(x, y, 'pfeil-OU');
						this.htmlBoard[x][0].classList.remove('pfeil-O');
						break;
					} else {
						this.setField(x, y, 'pfeil-O');
						this.setField(x, 0, 'pfeil-O');
					}
				}
			}
		}

		//schuss nach rechts
		if (this.board[x][y] !== ' ' && x == 0 && y > 0 && y < this.size - 1) {
			for (let z = 1; z < this.size - 1; z++) {
				if (this.htmlBoard[z][y].classList.contains('kugel')) {
					//kugel durch atom ersetzen
					this.setField(x, y, 'pfeil-LR');
					this.htmlBoard[this.size - 1][y].classList.remove('pfeil-R');
					break;
				}
				// if(atom eine reihe weiter)-->pfeil oben

				if (this.htmlBoard[z][y].classList.contains('kugel') === false) {
					if (
						this.htmlBoard[z][row].classList.contains('kugel') &&
						this.htmlBoard[z][rowR].classList.contains('kugel') !==
							this.htmlBoard[z][row].classList.contains('kugel')
					) {
						this.setField(z - 1, 0, 'pfeil-O');
						this.htmlBoard[this.size - 1][y].classList.remove('pfeil-R');
						break;
					}
					if (
						this.htmlBoard[z][rowR].classList.contains('kugel') &&
						this.htmlBoard[z][rowR].classList.contains('kugel') !==
							this.htmlBoard[z][row].classList.contains('kugel')
					) {
						this.setField(z - 1, this.size - 1, 'pfeil-U');
						this.htmlBoard[this.size - 1][y].classList.remove('pfeil-R');
						break;
					}
					for (let n = 1; n < this.size - 1; n++) {
						for (let j = row + 1; j < this.size - 1; j++) {
							if (
								this.htmlBoard[n][rowR].classList.contains('kugel') === true &&
								this.htmlBoard[n][j].classList.contains('kugel') === true
							) {
								console.log('colR	:' + rowR);
								console.log('j	:' + j);
								this.setField(x, y, 'pfeil-R');
								this.setField(x, j - 1, 'pfeil-L');
								this.htmlBoard[this.size][n - 1].classList.remove('pfeil-R');
							}
						}
					}

					for (let n = this.size - 1; n > 1; n--) {
						for (let j = rowR - 1; j > 0; j--) {
							if (
								this.htmlBoard[n][row].classList.contains('kugel') === true &&
								this.htmlBoard[n][j].classList.contains('kugel') === true
							) {
								console.log('colR	:' + rowR);
								console.log('j	:' + j);
								this.setField(x, y, 'pfeil-R');
								this.setField(x, j + 1, 'pfeil-L');
								this.htmlBoard[0].classList.remove('pfeil-L');
							}
						}
					}

					if (
						this.htmlBoard[z][rowR].classList.contains('kugel') === true &&
						this.htmlBoard[z][row].classList.contains('kugel') === true
					) {
						this.setField(x, y, 'pfeil-LR');
						this.htmlBoard[this.size - 1][y].classList.remove('pfeil-R');
						break;
					} else {
						this.setField(x, y, 'pfeil-R');
						this.setField(this.size - 1, y, 'pfeil-R');
					}
				}
			}
		}
		//schuss links
		if (this.board[x][y] !== ' ' && x == this.size - 1 && y > 0 && y < this.size - 1) {
			for (let z = this.size - 1; z > 1; z--) {
				if (this.htmlBoard[z][y].classList.contains('kugel')) {
					//kugel durch atom ersetzen
					this.setField(x, y, 'pfeil-LR');
					this.htmlBoard[0][y].classList.remove('pfeil-L');

					break;
				}

				if (this.htmlBoard[z][y].classList.contains('kugel') === false) {
					// if(atom eine reihe weiter)-->pfeil oben
					if (
						this.htmlBoard[z][row].classList.contains('kugel') &&
						this.htmlBoard[z][rowR].classList.contains('kugel') !==
							this.htmlBoard[z][row].classList.contains('kugel')
					) {
						this.setField(z + 1, 0, 'pfeil-O');
						this.htmlBoard[0][y].classList.remove('pfeil-L');
						break;
					}
					if (
						this.htmlBoard[z][rowR].classList.contains('kugel') &&
						this.htmlBoard[z][rowR].classList.contains('kugel') !==
							this.htmlBoard[z][row].classList.contains('kugel')
					) {
						this.setField(z + 1, this.size - 1, 'pfeil-U');
						this.htmlBoard[0][y].classList.remove('pfeil-L');
						break;
					}
					for (let n = this.size - 1; n > 1; n--) {
						for (let j = row + 1; j < this.size - 1; j++) {
							if (
								this.htmlBoard[n][rowR].classList.contains('kugel') === true &&
								this.htmlBoard[n][j].classList.contains('kugel') === true
							) {
								console.log('colR	:' + rowR);
								console.log('j	:' + j);
								this.setField(x, y, 'pfeil-L');
								this.setField(x, j - 1, 'pfeil-R');
								this.htmlBoard[this.size][n - 1].classList.remove('pfeil-R');
							}
						}
					}

					for (let n = 1; n < this.size - 1; n++) {
						for (let j = rowR - 1; j > 0; j--) {
							if (
								this.htmlBoard[n][row].classList.contains('kugel') === true &&
								this.htmlBoard[n][j].classList.contains('kugel') === true
							) {
								console.log('colR	:' + rowR);
								console.log('j	:' + j);
								this.setField(x, y, 'pfeil-L');
								this.setField(x, j + 1, 'pfeil-R');
								this.htmlBoard[0].classList.remove('pfeil-L');
							}
						}
					}

					if (
						this.htmlBoard[z][rowR].classList.contains('kugel') === true &&
						this.htmlBoard[z][row].classList.contains('kugel') === true
					) {
						this.setField(x, y, 'pfeil-LR');
						this.htmlBoard[0][y].classList.remove('pfeil-L');
						break;
					} else {
						this.setField(x, y, 'pfeil-L');
						this.setField(0, y, 'pfeil-L');
					}
				}
			}
		}

		//schuss nach unten
		if (this.board[x][y] !== ' ' && y == 0 && x > 0 && x < this.size - 1) {
			for (let z = 1; z < this.size - 1; z++) {
				//if (atom frontal eintrifft)
				if (this.htmlBoard[x][z].classList.contains('kugel')) {
					//kugel durch atom ersetzen
					this.setField(x, y, 'pfeil-OU');
					this.htmlBoard[x][this.size - 1].classList.remove('pfeil-U');
					//console.log('test1');
					break;
				}

				if (this.htmlBoard[x][z].classList.contains('kugel') === false) {
					// if(atom eine spalte weiter)-->pfeil Links
					if (
						this.htmlBoard[col][z].classList.contains('kugel') &&
						this.htmlBoard[colR][z].classList.contains('kugel') !==
							this.htmlBoard[col][z].classList.contains('kugel')
					) {
						this.setField(0, z - 1, 'pfeil-L');
						this.htmlBoard[x][this.size - 1].classList.remove('pfeil-U');
						//console.log('test3');
						break;
					} else if (
						this.htmlBoard[colR][z].classList.contains('kugel') &&
						this.htmlBoard[colR][z].classList.contains('kugel') !==
							this.htmlBoard[col][z].classList.contains('kugel')
					) {
						this.setField(this.size - 1, z - 1, 'pfeil-R');
						this.htmlBoard[x][this.size - 1].classList.remove('pfeil-U');
						//console.log('test3');
						break;
					}
					for (let n = 1; n < this.size - 1; n++) {
						for (let j = col + 1; j < this.size - 1; j++) {
							if (
								this.htmlBoard[colR][n].classList.contains('kugel') === true &&
								this.htmlBoard[j][n].classList.contains('kugel') === true
							) {
								console.log('colR	:' + colR);
								console.log('j	:' + j);
								this.setField(x, y, 'pfeil-U');
								this.setField(j - 1, y, 'pfeil-O');
								this.htmlBoard[this.size][n - 1].classList.remove('pfeil-R');
							}
						}
					}

					for (let n = this.size - 1; n > 1; n--) {
						for (let j = colR - 1; j > 0; j--) {
							if (
								this.htmlBoard[col][n].classList.contains('kugel') === true &&
								this.htmlBoard[j][n].classList.contains('kugel') === true
							) {
								console.log('colR	:' + colR);
								console.log('j	:' + j);
								this.setField(x, y, 'pfeil-U');
								this.setField(j + 1, y, 'pfeil-O');
								this.htmlBoard[0].classList.remove('pfeil-L');
							}
						}
					}

					if (
						this.htmlBoard[colR][z].classList.contains('kugel') === true &&
						this.htmlBoard[col][z].classList.contains('kugel') === true
					) {
						this.setField(x, y, 'pfeil-OU');
						this.htmlBoard[x][this.size - 1].classList.remove('pfeil-U');
						break;
					} else {
						this.setField(x, y, 'pfeil-U');
						this.setField(x, this.size - 1, 'pfeil-U');
						//console.log('test2');
					}
				}
			}
		}
	},

	setAtomField(x, y) {
		if (y > 0 && y < this.size - 1 && x > 0 && x < this.size - 1) {
			if (this.htmlBoard[x][y].classList.contains('atom') === false) {
				this.setField(x, y, 'atom');
			} else if (this.htmlBoard[x][y].classList.contains('atom') === true) {
				this.htmlBoard[x][y].classList.remove('atom');

				//console.log('testttt');
			}
		}
	},

	checkWin() {
		var win = false;
		for (let k = 0; k < this.size; k++) {
			for (let z = 0; z < this.size; z++) {
				if (this.htmlBoard[k][z].classList.contains('atom')) {
					if (this.htmlBoard[k][z].classList.contains('kugel')) {
						win = true;
					} else {
						win = false;
					}
				}
				if (this.htmlBoard[k][z].classList.contains('kugel')) {
					if (this.htmlBoard[k][z].classList.contains('atom') == false) {
						win = false;
					}
				}
			}
		}
		return win;
	}
};
