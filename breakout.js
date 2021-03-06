
// -----------------------------------------
// 	breakout.js
//	eecs 368 final project
//	julia drahozal
// -----------------------------------------

// --------------------
//	important constants
// --------------------

// board
var canvas = document.getElementById ("myCanvas");
var board = canvas.getContext ("2d");
var boardW = 600;
var boardH = 705;

// set canvas width and height
board.canvas.width = boardW;
board.canvas.height = boardH;

// ball
var ballO = 5;
var ballR = 10;

// paddle
var paddleW = 80;
var paddleH = 20;
var paddleO = 5;
var paddleY = boardH - paddleH - paddleO;

// bricks
var brickR = 18;
var brickC = 10;
var brickO = 5;
var brickW = (boardW - brickO * (brickC + 1)) / brickC;
var brickH = 20;

// lives
var lifeO = 5;
var lifeR = 10;

// --------------------
//	important variables
// --------------------

// ball
var ballX;
var ballY;
var ballDX;
var ballDY;

// paddle
var paddleX;
var right;
var left;

// bricks
var bricks;

// game
var gameInit;
var gameOver;
var gameWon;
var gameLifeLost;
var score;
var pause;
var startPause;
var startPauseTimer;
var lives;

// run initialization
initializeVars ();

// initialize variables
function initializeVars ()
{
	placeBall ();
	placePaddle ();
	fillBricks ();
	gameInit = true;
	gameOver = false;
	gameWon = false;
	gameLifeLost = false;
	score = 0;
	pause = false;
	startPause = false;
	lives = 3;
	startCountdown ();
}

// place ball
function placeBall ()
{
	ballX = boardW / 2;
	ballY = boardH * 3 / 4;
	// random chance to move left or right to start
	var dx = Math.floor ((Math.random () * 2) + 1);
	if (dx == 1)
	{
		ballDX = 1.5;
	}
	else
	{
		ballDX = -1.5;
	}
	ballDY = -1.5;
}

// place paddle
function placePaddle ()
{
	paddleX = boardW / 2 - paddleW / 2;
	right = false;
	left = false;
}

// fill brick array
function fillBricks ()
{
	bricks = [[]];
	for (var r = 0; r < brickR; r++)
	{
		bricks[r] = [];
		for (var c = 0; c < brickC; c++)
		{
			// random int from 1 - 5
			bricks [r][c] = Math.floor ((Math.random () * 5) + 1);
		}
	}
}

// start countdown
function startCountdown ()
{
	startPause = true;
	startPauseTimer = 400;
}

// --------------------
//	run program
// --------------------

// call playBreakout every 10 ms
setInterval (playBreakout, 10);

// play game
function playBreakout ()
{
	// game is initializing
	if (gameInit)
	{
		drawGameInit ();
	}
	// game is over
	else if (gameOver)
	{

		var breakoutpts = getUrlParam ("breakoutpts");
		var blackjackpts = getUrlParam ("blackjackpts");
		var blockrunnerpts = getUrlParam ("blockrunnerpts");

		if (score > breakoutpts)
		{
			breakoutpts = score;
		}

		drawGameOver ();

		window.location.href = "breakout.html?breakoutpts=" + breakoutpts + "&blackjackpts=" + blackjackpts + "&blockrunnerpts=" + blockrunnerpts;

	}
	// game is won
	else if (gameWon)
	{

		var breakoutpts = getUrlParam ("breakoutpts");
		var blackjackpts = getUrlParam ("blackjackpts");
		var blockrunnerpts = getUrlParam ("blockrunnerpts");

		if (score > breakoutpts)
		{
			breakoutpts = score;
		}

		drawGameWon ();

		window.location.href = "breakout.html?breakoutpts=" + breakoutpts + "&blackjackpts=" + blackjackpts + "&blockrunnerpts=" + blockrunnerpts;
	}
	// life lost
	else if (gameLifeLost)
	{
		drawGameLifeLost ();
	}
	// game is running
	else
	{
		runGame ();
	}
}

// run main part of game
function runGame ()
{
	// initial countdown
	if (startPause)
	{
		startPauseTimer--;
		if (startPauseTimer == 0)
		{
			startPause = false;
		}

		// clear board
		board.clearRect (0, 0, boardW, boardH);

		// draw updated board
		drawBall ();
		drawPaddle ();
		drawBricks ();
		drawCountdown ();
		drawLives ();
		drawScore ();
	}
	// game is paused
	else if (pause)
	{
		drawPause ();
	}
	// game is running
	else
	{
		// update positions
		moveBall ();
		movePaddle ();

		// check for collisions
		checkPaddleHit ();
		checkBrickHit ();
		checkBounce ();

		// check if game is won
		checkgameWon ();

		// update speed of ball
		speedUp ();

		// clear board
		board.clearRect (0, 0, boardW, boardH);

		// draw updated board
		drawBall ();
		drawPaddle ();
		drawBricks ();
		drawLives ();
		drawScore ();
	}
}

// --------------------
//	event handlers
// --------------------

// key press
document.addEventListener ("keydown", keyPressHandler, false);
function keyPressHandler (key)
{
	// right arrow pressed
	if (key.keyCode == 39)
	{
		// move paddle right
		right = true;
	}
	// left arrow pressed
	else if (key.keyCode == 37)
	{
		// move paddle left
		left = true;
	}
	// space bar pressed
	else if (key.keyCode == 32)
	{
		// start game
		if (gameInit)
		{
			gameInit = false;
			startPause = true;
		}
		// restart on next life
		else if (gameLifeLost)
		{
			placeBall ();
			placePaddle ();
			startCountdown ();
			gameLifeLost = false;
		}
		// toggle pause
		else
		{
			if (!startPause) {
				pause = !pause;
			}
		}
	}
}

// key release
document.addEventListener ("keyup", keyReleaseHandler, false);
function keyReleaseHandler (key)
{
	// right arrow released
	if (key.keyCode == 39)
	{
		// stop moving paddle right
		right = false;
	}
	// left arrow released
	else if (key.keyCode == 37)
	{
		// stop moving paddle left
		left = false;
	}
}

// --------------------
//	move & interact with objects
// --------------------

// move ball according to velocity
function moveBall ()
{
	ballX += ballDX;
	ballY += ballDY;
}

// move paddle based on key press
function movePaddle ()
{
	if (right && (paddleX < boardW - paddleW - paddleO))
	{
		// move right
		paddleX += 4;
	}
	else if (left && paddleX > paddleO)
	{
		// move left
		paddleX -= 4;
	}
}

// check if ball hits paddle or bottom
function checkPaddleHit ()
{
	if (ballY + ballDY > boardH - ballR - paddleO)
	{
		// hit paddle
		if (ballX > paddleX && ballX < paddleX + paddleW)
		{
			// bounce
			ballDY = -ballDY;
		}
		// hit bottom
		else
		{
			lives--;
			if (lives == 0)
			{
				gameOver = true;
			}
			else
			{
				gameLifeLost = true;
			}
		}
	}
}

// check if ball hits brick
function checkBrickHit ()
{
	for (var r = 0; r < brickR; r++)
	{
		for (var c = 0; c < brickC; c++)
		{
			// brick still exists
			if (bricks[r][c] != 0)
			{
				var brickX = brickO + c * (brickW + brickO);
				var brickY = brickO + r * (brickH + brickO);
				// hit brick
				if (((ballX > brickX) && (ballX < brickX + brickW)) && ((ballY > brickY) && (ballY < brickY + brickH)))
				{
					// bounce
					ballDY = -ballDY;
					// clear from array
					bricks[r][c] = 0;
					// update score
					score ++;
				}
			}
		}
	}
}

// check if ball bounces off sides
function checkBounce ()
{
	// hit sides
	if ((ballX + ballDX) > (boardW - ballR - ballO) || (ballX + ballDX) < (ballR + ballO))
	{
		// bounce
		ballDX = -ballDX;
	}

	// hit top
	if ((ballY + ballDY) < (ballR + ballO))
	{
		// bounce
		ballDY = -ballDY;
	}
}

// check if all bricks are gone
function checkgameWon ()
{
	gameWon = true;
	for (var r = 0; r < brickR; r++)
	{
		for (var c = 0; c < brickC; c++)
		{
			if (bricks[r][c] != 0)
			{
				gameWon = false;
			}
		}
	}
}

// update ball dx and dy based on rows cleared
function speedUp ()
{
	// count rows cleared
	var rowsCleared = 0;
	for (var r = 0; r < brickR; r++)
	{
		var rowCleared = true;
		for (var c = 0; c < brickC; c++)
		{
			if (bricks[r][c] != 0)
			{
				rowCleared = false;
			}
		}
		if (rowCleared)
		{
			rowsCleared++;
		}
	}

	// update speed
	var speed = 1.5 + rowsCleared * 0.1;
	if (ballDX > 0)
	{
		ballDX = speed;
	}
	else
	{
		ballDX = -speed;
	}
	if (ballDY > 0)
	{
		ballDY = speed;
	}
	else
	{
		ballDY = -speed;
	}
}

// --------------------
//	draw canvas objects
// --------------------

// draw ball
function drawBall ()
{
	board.beginPath ();
	board.arc (ballX, ballY, ballR, 0, Math.PI * 2, false);
	board.fillStyle = "#555555";
	board.fill ();
	board.closePath ();
}

// draw paddle
function drawPaddle ()
{
	board.beginPath ();
	board.rect (paddleX, paddleY, paddleW, paddleH);
	board.fillStyle = "#555555";
	board.fill ();
	board.closePath ();
}

// draw bricks
function drawBricks ()
{
	for (var r = 0; r < brickR; r++)
	{
		for (var c = 0; c < brickC; c++)
		{
			// brick is not empty
			if (bricks[r][c] != 0)
			{
				// calculate position
				var brickX = brickO + c * (brickW + brickO);
				var brickY = brickO + r * (brickH + brickO);

				board.beginPath ();
				board.rect (brickX, brickY, brickW, brickH);
				// get color
				var fill = bricks[r][c];
				switch (fill)
				{
					case 1:
						board.fillStyle = "#4cb7d6";
						break;
					case 2:
						board.fillStyle = "#72ff5c";
						break;
					case 3:
						board.fillStyle = "#ffec7c";
						break;
					case 4:
						board.fillStyle = "#ffc22e";
						break;
					case 5:
						board.fillStyle = "#ff774a";
						break;
					default:
						board.fillStyle = "black";
				}
				board.fill ();
				board.closePath ();
			}
		}
	}
}

// draw lives remaining
function drawLives ()
{
	for (var i = 0; i < lives; i++)
	{
		var lifeX = boardW - lifeO * 3 - (i + 1) * (lifeR * 2 + lifeO);
		var lifeY = lifeO * 3 + lifeR;

		board.beginPath ();
		board.arc (lifeX, lifeY, lifeR, 0, Math.PI * 2, false);
		board.fillStyle = "#555555";
		board.fill ();
		board.closePath ();

	}
}

// draw score
function drawScore ()
{
	board.font = "Lighter 20px Helvetica";
	board.textAlign = "center";
	board.fillStyle = "#555555";
	board.fillText (score, lifeO * 4 + lifeR * 2, lifeO * 7)
}

// draw countdown to game start
function drawCountdown ()
{
	var countdown = Math.floor (startPauseTimer / 100);
	if (countdown == 0)
	{
		countdown = "g o";
	}
	board.font = "Lighter 50px Helvetica";
	board.textAlign = "center";
	board.fillStyle = "#555555";
	board.fillText (countdown, boardW / 2, boardH / 2);
}

// draw pause message
function drawPause ()
{
	board.font = "Lighter 50px Helvetica";
	board.textAlign = "center";
	board.fillStyle = "#555555";
	board.fillText ("p a u s e", boardW / 2, boardH / 2);
}

// --------------------
//	draw game screens
// --------------------

// draw game started screen
function drawGameInit ()
{
	// clear board
	board.clearRect (0, 0, boardW, boardH);

	// draw title
	board.font = "Lighter 50px Helvetica";
	board.textAlign = "center";
	board.fillStyle = "#555555";
	board.fillText ("p l a y", boardW / 2, boardH / 2 - 200);
	board.fillText ("b r e a k o u t", boardW / 2, boardH / 2 - 100);
	board.fillText ("- - - - - - - - - - - - - - -", boardW / 2, boardH / 2);

	// draw subtitle
	board.font = "Lighter 20px Helvetica";
	board.fillText ("< -   - >   t o   m o v e", boardW / 2, boardH / 2 + 50);
	board.fillText ("[ s p a c e ]   t o   b e g i n", boardW / 2, boardH / 2 + 100);
	board.fillText ("[ s p a c e ]   t o   p a u s e", boardW / 2, boardH / 2 + 150);
	board.fillText ("y o u   h a v e   t h r e e   l i v e s", boardW / 2, boardH / 2 + 200);
}

// draw game over screen
function drawGameOver ()
{
	// clear board
	board.clearRect (0, 0, boardW, boardH);

	// redraw bricks
	drawBricks ();

	// draw title
	board.font = "Lighter 50px Helvetica";
	board.textAlign = "center";
	board.fillStyle = "#555555";
	board.fillText ("g a m e   o v e r", boardW / 2, boardH / 2 - 75);
	board.fillText ("- - - - - - - - - - - - - - -", boardW / 2, boardH / 2);

	// draw subtitle
	board.font = "Lighter 20px Helvetica";
	if (score == 1)
	{
		var str = "y o u   c l e a r e d   " + score + "   b r i c k";
	}
	else
	{
		var str = "y o u   c l e a r e d   " + score + "   b r i c k s";
	}
	board.fillText (str, boardW / 2, boardH / 2 + 50);
}

// draw game won screen
function drawGameWon ()
{
	// clear board
	board.clearRect (0, 0, boardW, boardH);

	// draw title
	board.font = "Lighter 50px Helvetica";
	board.textAlign = "center";
	board.fillStyle = "#555555";
	board.fillText ("y o u   w i n !", boardW / 2, boardH / 2 - 75);
	board.fillText ("- - - - - - - - - - - - - - -", boardW / 2, boardH / 2);

	// draw subtitle
	board.font = "Lighter 20px Helvetica";
	var str = "y o u   c l e a r e d   a l l   " + score + "   b r i c k s";
	board.fillText (str, boardW / 2, boardH / 2 + 50);
}

// draw game life lost screen
function drawGameLifeLost ()
{
	// clear board
	board.clearRect (0, 0, boardW, boardH);

	// redraw board
	drawBricks ();
	drawPaddle ();
	drawLives ();
	drawScore ();

	// draw subtitle
	board.font = "Lighter 20px Helvetica";
	board.textAlign = "center";
	board.fillStyle = "#555555";
	board.fillText ("[ s p a c e ]   t o   k e e p   g o i n g", boardW / 2, boardH / 2);

}


function getUrlParam (param)
{
  param = param.replace(/([\[\](){}*?+^$.\\|])/g, "\\$1");
  var regex = new RegExp("[?&]" + param + "=([^&#]*)");
  var url   = decodeURIComponent(window.top.location.href);
  var match = regex.exec(url);
  return match ? match[1] : "";
}
