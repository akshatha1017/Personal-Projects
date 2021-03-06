var origBoard; //Original Board: Eventually becoming an array that keeps track of whats there on the tic-tac-toe board
const humanPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
	[0,1,2],
	[3,4,5],
	[6,7,8],
	[0,3,6],
	[1,4,7],
	[2,5,8],
	[0,4,8],
	[6,4,2]
]
const cell = document.querySelectorAll('.cell'); //the cell variable is going to store a reference to all the cells in the tictactoe.html
startGame();

function startGame() {
		document.querySelector(".endgame").style.display = "none";
		origBoard = Array.from(Array(9).keys()); //Create an array of 9 elements an create an array from another array
		for (var i = 0; i<cell.length; i++) {
				cell[i].innerText = '';
				cell[i].style.removeProperty('background-color');
				cell[i].addEventListener('click',turnClick, false);
		}
}
function turnClick(square){ //pass in click event
		if (typeof origBoard[square.target.id] == 'number'){
				turn(square.target.id, humanPlayer) //the turn function can either be called with the human player or the computer
				if(!checkWin(origBoard, humanPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
		}	
}

function turn(squareId, player){ //takes in square ID and player
		origBoard[squareId] = player;
		document.getElementById(squareId).innerText = player;
		let gameWon = checkWin(origBoard,player)
		if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
		let plays = board.reduce((a, e, i) => 
			(e === player) ? a.concat(i) : a, []);
		let gameWon = null;
		for (let [index, win] of winCombos.entries()) {
				if (win.every(elem => plays.indexOf(elem) > -1)) {
						gameWon = {index: index, player: player};
						break;
				}
		}
		return gameWon;
}


function gameOver(gameWon){
		for (let index of winCombos[gameWon.index]) {
				document.getElementById(index).style.backgroundColor =
						gameWon.player == humanPlayer ? "blue" : "red"; //The human player is blue and the computer is red

		}
		for (var i = 0; i < cell.length; i++){
			cell[i].removerEventListener('click', turnClick, false);
		}
		declareWinner(gameWon.player == humanPlayer ? "You win!" : "You loose!");
}

function declareWinner(who) {
		document.querySelector(".endgame").style.display = "block";
		document.querySelector(".endgame. text").innerText = who;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');

}

function bestSpot() {
  		return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0){
			for (var i = 0; i < cell.length; i++){
				  cell[i].style.backgroundColor = "green";
				  cell[i].removerEventListener('click', turnClick, false);
			}
			declareWinner("Tie Game!")
			return true;

	}
	return false;
}

function minimax(newBoard, player){
  var availSpots = emptySquares(newBoard);

  if(checkWin(newBoard, player)){
  	return{score : -10};
  } else if (checkWin(newBoard, aiPlayer)){
  	return{score:10};
  } else if(availSpots.length == 0){
  	return {score: 0};
  }
  var moves = [];
  for (var i = 0; i < availSpots.length; i++){
  	var move = {}
  	move.index = newBoard[availSpots[i]];
  	newBoard[availSpots[i]] = player;

  	if (player == aiPlayer){
  		var result = minimax(newBoard, humanPlayer);
  		move.score = result.score;
  	} else {
  		var result = minimax(newBoard,aiPlayer);
  		move.score = result.score;
  	}

  	newBoard[availSpots[i]] = move.index;
  	
  	moves.push(move);
  }

  var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}