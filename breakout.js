// -----------------------------------------
// 	breakout.js
//	eecs 368 final project
//	julia drahozal
// -----------------------------------------

// --------------------
//	variables
// --------------------

// board variables
var canvas = document.getElementById ("myCanvas");
var board = canvas.getContext ("2d");
var boardW = 600;
var boardH = 700;
board.canvas.width = boardW;
board.canvas.height = boardH;
var text = document.getElementById ("p1");

// ball variables
var ballX = boardW / 2;
var ballY = boardH * 3 / 4;
var ballR = 10;
var ballDX = 2;
var ballDY = -2;

// paddle variables
var paddleW = 80;
var paddleH = 20;
var paddleO = 5;
var paddleX = boardW / 2 - paddleW / 2;
var paddleY = boardH - paddleH - paddleO;
var right = false;
var left = false;

// brick variables
var brickR = 15;
var brickC = 10;
var brickO = 5;
var brickW = (boardW - brickO * (brickC + 1)) / brickC;
var brickH = 20;
var bricks = [[]];
for (var r = 0; r < brickR; r++)
{
	bricks[r] = [];
	for (var c = 0; c < brickC; c++)
	{
		bricks [r][c] = Math.floor ((Math.random () * 5) + 1);
	}
}

// game variables
var gameInit = true;
var gameOver = false;
var gameWon = false;
var score = 0;

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
		gameInit = false;
	}
}

// key release
document.addEventListener ("keyup", keyReleaseHandler, false);
function keyReleaseHandler (key)
{
	// right arrow released
	if (key.keyCode == 39)
	{
		right = false;
	}
	// left arrow released
	else if (key.keyCode == 37)
	{
		left = false;
	}
}

// --------------------
//	run program
// --------------------

// call run every 10 ms
var interval = setInterval (run, 10);

// run game
function run ()
{
	// game is initializing
	if (gameInit)
	{
		drawGameInit ();
	}
	// game is over
	else if (gameOver)
	{
		drawGameOver ();
	}
	// game is won
	else if (gameWon)
	{
		drawGameWon ();
	}
	// game is still going
	else
	{
		// update positions
		moveBall ();
		movePaddle ();
		checkPaddleHit ();
		checkBrickHit ();
		checkBounce ();
		checkgameWon ();

		// clear display
		board.clearRect (0, 0, boardW, boardH);

		// draw updated board
		drawBall ();
		drawPaddle ();
		drawBricks ();
	}
}

// --------------------
//	update display variables
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
	// move paddle
	if (right && (paddleX < boardW - paddleW))
	{
		paddleX += 4;
	}
	else if (left && paddleX > 0)
	{
		paddleX -= 4;
	}
}

// check if ball hits paddle or bottom
function checkPaddleHit ()
{
	if ((ballY + ballDY) > (boardH - ballR - paddleO))
	{
		// hit paddle
		if (ballX > paddleX && ballX < paddleX + paddleW)
		{
			ballDY = -ballDY;
		}
		// hit bottom
		else
		{
			gameOver = true;
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
			if (bricks[r][c] != 0)
			{
				var brickX = brickO + c * (brickW + brickO);
				var brickY = brickO + r * (brickH + brickO);
				if ((ballX > brickX && ballX < (brickX + brickW)) && (ballY > brickY && ballY < brickY + brickH))
				{
					ballDY = -ballDY;
					bricks[r][c] = 0;
					score ++;
				}
			}
		}
	}
}

// check if ball bounces off sides
function checkBounce ()
{
	// bounce off sides
	if ((ballX + ballDX) > (boardW - ballR) || (ballX + ballDX) < ballR)
	{
		ballDX = -ballDX;
	}

	// bounce off top
	if ((ballY + ballDY) < ballR)
	{
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

// --------------------
//	draw display
// --------------------

// draw ball
function drawBall ()
{
	board.beginPath ();
	board.arc (ballX, ballY, ballR, 0, Math.PI * 2, false);
	board.fillStyle = "#000000";
	board.fill ();
	board.closePath ();
}

// draw paddle
function drawPaddle ()
{
	board.beginPath ();
	board.rect (paddleX, paddleY, paddleW, paddleH);
	board.fillStyle = "#000000";
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
			if (bricks[r][c] != 0)
			{
				var brickX = brickO + c * (brickW + brickO);
				var brickY = brickO + r * (brickH + brickO);

				board.beginPath ();
				board.rect (brickX, brickY, brickW, brickH);
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

// draw game started screen
function drawGameInit ()
{
	
	board.font = "70px Helvetica";
	board.textAlign = "center";
	board.fillStyle = "black";
	board.fillText ("Welcome", boardW/2, boardH/2);
}

// draw game over screen
function drawGameOver ()
{
	board.font = "70px Helvetica";
	board.textAlign = "center";
	board.fillStyle = "black";
	board.fillText ("Game Over", boardW/2, boardH/2);

	board.font = "30px Helvetica";
	board.textAlign = "center";
	board.fillStyle = "black";
	board.fillText ("You cleared " + score + " bricks", boardW/2, boardH/2 + 50);
}

// draw game won screen
function drawGameWon ()
{
	board.font = "70px Helvetica";
	board.textAlign = "center";
	board.fillStyle = "black";
	board.fillText ("You win!", boardW/2, boardH/2);
}
