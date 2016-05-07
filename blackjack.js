/*
*	@author: Justin Lee
*	@date:	2016/05/04
*	@name:	blackjack.js
* @about: simple blackjack game that has betting and interacts with blackjack.html
* @github: https://github.com/JustinLee1533/EECS368-P3.git
*/
var gameDeck = new Deck();	//Deck object
var gameDealer = new Dealer();  //Dealer object
var gamePlayer = new Player(); //player object
var gameGame = new game(); //game object
var playerLost = false; //boolean that keeps track of whether the player lost
var gameOver = false; //boolean that keeps track whether the current game is over
var ducats = 200; //boolean that keeps track of the player's currency
var bet = 0;  // number that keeps track of the current bet
var playNumber = 0; //number that keeps track of the current game numbers

/*
	@Pre: Called from New Game button in HTML
	@Post: sets bet, increments play number, calls game.play() function
	@Return: None
*/
function playGame()
{
  bet = Number(document.getElementById("bet").value); //Locks in bet as soon as they hit new game
  playNumber++;
  gameGame.play();
}

/*
	@Pre: None
	@Post: A dealer object is created
	@Return: None
*/
function Dealer()
{
    this.hand = [];
    this.hits =false;
    this.stands = false;
    this.busts = false;
}

/*
	@Pre: None
	@Post: A Player object is created
	@Return: None
*/
function Player()
{
  this.hand = [];
  this.hits =false;
  this.stands = false;
}

/*
  @Pre: called from an HTML button press
  @Post: calls the hit function the game object
  @Return: None
*/
function hit()
{
  gameGame.hit();
}

/*
  @Pre: called from an html button
  @Post: calls the stand function the game object
  @Return: None
*/
function stand()
{
  gameGame.stand();
}


/*
	@Pre: None
	@Post: A game object is created
	@Return: None
*/
function game()
{

  /*
  	@Pre: game object is created, function called from playGame()
  	@Post: initializes the game, deals cards, determines if there is a blackjack
  	@Return: void if forfeit, win, or loss
  */
  this.play = function()
  {
    document.getElementById("p3").innerHTML = ducats;
    document.getElementById("p0").innerHTML = "Starting new game";
    console.log("playing game");

    if((playNumber >1)&&(gameOver == false)) //check to make sure they're not trying to start a new game during an active one, if they do, its a forfeit
    {
      gameOver = true;
      ducats = ducats - bet;
      document.getElementById("p3").innerHTML = ducats;
      document.getElementById("p0").innerHTML = "You forfeit the game and lose your bet. Press New Game";
      return;

    }
    //ensure the hands are cleared
    gameDealer.hand = [];
    gamePlayer.hand = [];

    gameOver = false;
    playerLost = false;

    //initialize Deck
    gameDeck.initialize();

    //shuffle Deck
    gameDeck.shuffle();

    //deal two cards to the player
    var c1 = gameDeck.cardArr.pop();
    console.log("Player's first card:"+c1.rank);
    gamePlayer.hand.push(c1);

    var c2 = gameDeck.cardArr.pop();
    console.log("Player's second card: "+c2.rank);
    gamePlayer.hand.push(c2);

    //deal two cards to the dealer
    var c3 = gameDeck.cardArr.pop();
    console.log("Dealers's first card:"+c3.rank);
    gameDealer.hand.push(c3);

    var c4 = gameDeck.cardArr.pop();
    console.log("Dealers's Second card:"+c4.rank);
    gameDealer.hand.push(c4);

    this.printHands(false);

    //check to see if either player has a blackjack
    if((this.handVal(gamePlayer.hand))==21 && (this.handVal(gameDealer.hand) ==21))
    {
      //game is a tie, both players have natual black jack
      document.getElementById("p0").innerHTML = "Both player's have blackjacks, tie.  Press New Game";
      gameOver = true;

      return;
    }else if ((this.handVal(gamePlayer.hand))==21)
    {
      //player wins natural blackjack
      document.getElementById("p0").innerHTML = "You win a natural blackjack. Press New Game.";

      gameOver = true;
      ducats = ducats + bet;
      document.getElementById("p3").innerHTML = ducats;
      return;
    }else if (this.handVal(gameDealer.hand) ==21)
    {
      gameOver = true;
      ducats = ducats - bet;
      document.getElementById("p3").innerHTML = ducats;

      document.getElementById("p0").innerHTML = "Dealer has natural blackjack. Press New Game";
      //dealer wins natural blackjack
      return;
    }
  }

  /*
    @Pre: called from hit(), the player has not lost the game
    @Post: adds new card to the players hand
    @Return: false if the player has busted
  */
  this.hit = function()
  {
      if((this.handVal(gamePlayer.hand)<21)&&(gameOver == false))
      {
        console.log("adding card to player's hand");
        gamePlayer.hand.push(gameDeck.cardArr.pop());
        this.printHands(false);

        if((this.handVal(gamePlayer.hand))>21)  //player has busted, gameover
        {
          playerLost = true;
          gameOver = true;
          this.printHands(true);
          ducats = ducats - bet;
          document.getElementById("p3").innerHTML = ducats;

          document.getElementById("p0").innerHTML = "You lose. Press New Game.";
          return;
        }else if((this.handVal(gamePlayer.hand))==21)//call stand for the player
        {
          document.getElementById("p0").innerHTML = "You have 21. Dealer's Turn.";
          this.stand();
        }
      }
    }

    /*
    	@Pre: called from stand(), the player has not lost the game
    	@Post: dealer hits until the value of its hand is at least 17, changes betting values
    	@Return: Tvoid if there is a win/loss/tie
    */
  this.stand = function()
  {
    if((playerLost == false)&&(gameOver == false))
    {
      //call dealer function
      while(this.handVal(gameDealer.hand)<17)//if dealers hand< 17 hit
      {
        gameDealer.hand.push(gameDeck.cardArr.pop());
        this.printHands(false);

        if((this.handVal(gameDealer.hand))>21)  //Dealer has busted, gameover
        {
          gameDealer.busts = true;
          gameOver = true;
          this.printHands(true);
          ducats = ducats + bet;
          document.getElementById("p3").innerHTML = ducats;
          document.getElementById("p0").innerHTML = "dealer busts, you win, press New Game";
          return;
        }

      }
        if((this.handVal(gamePlayer.hand))>(this.handVal(gameDealer.hand)))//player wins
        {
          gameOver = true;
          this.printHands(true);
          document.getElementById("p0").innerHTML = "You Win, Press New Game";
          ducats = ducats + bet;
          document.getElementById("p3").innerHTML = ducats;
          return;
        }else if ((this.handVal(gamePlayer.hand))<(this.handVal(gameDealer.hand)))//dealer wins
        {
          gameOver = true;
          this.printHands(true);
          ducats = ducats - bet;
          document.getElementById("p3").innerHTML = ducats;
          document.getElementById("p0").innerHTML = "You Lose, Press New Game";
          return;
        }else if((this.handVal(gamePlayer.hand))==(this.handVal(gameDealer.hand))) //tie
        {
          gameOver = true;
          this.printHands(true);
          document.getElementById("p0").innerHTML = "The game is a tie, Press New Game";
          return;
        }
      }
    }


  /*
  	@Pre: the dealers or players hand array is passed in
  	@Post: The value of their hand is computed
  	@Return: The value of their hand
  */
  this.handVal = function(arr)
  {
    var sum = 0;
    var otherSum = 0;
    console.log("this hand has "+arr.length+" cards");

    //ace check
    var aceFlag = false;
    var aceIndex;
    for(var i = 0;((i<arr.length)&&!(aceFlag)); i++) // check to see if there is an ace in the hand
    {
      if(arr[i].rank == 1)  //note the index at which the ace occurs
      {
        aceFlag = true;
        aceIndex = i;
      }
    }

    for(var i=0; i< arr.length; i++) //compute two seperate values one for the high ace and one for the low, if there are no aces, values will be the same
    {
      var tempVal = arr[i].rank;
      var othertempVal = tempVal;
      console.log("Value of card "+i+" is: "+arr[i].rank);
      if(tempVal>=10)
      {
        tempVal = 10;
      }

      if(i == aceIndex)
      {
        othertempVal = 11;
      }else if(othertempVal>=10)
      {
        othertempVal = 10;
      }

      otherSum += othertempVal;
      sum += tempVal;
      console.log("sum: "+sum);
      console.log("otherSum: "+otherSum);
    }

    if((otherSum<=21) && (aceFlag == true)) //return the higher sum if its not over 21, else the lower
    {
      return(otherSum);
    }else
    {
      return(sum);
    }
  }

  /*
    @Pre: None
    @Post: The two current hands are written to the HTML document
    @Return: None
  */
  this.printHands = function(flag)
  {
    console.log("printing hands");
    var j = 1; //variable used to toggle whether to print the dealers first card or not afte the game is over
    var hiddenHand =[];
    hiddenHand[0] = "X";
    console.log("Dealers Hand");
    console.log("Dealers Hand length: "+gameDealer.hand.length);

    if(flag == true)
    {
      j = 0;
    }

    for(var i = j; i<gameDealer.hand.length; i++) //print dealers hand
    {
      var tempCard = gameDealer.hand[i];
      var rankNo = tempCard.rank;
      var suitS = tempCard.suit;

      if(rankNo == 11)//convert certain ranks to face cards or ace
      {
        rankNo = "J";
      }else if(rankNo == 12)
      {
        rankNo = "Q"
      }else if(rankNo == 13)
      {
        rankNo = "K";
      }else if((rankNo == 1)||(rankNo == -1))
      {
        rankNo = "A";
      }
      console.log("value of the card: "+rankNo);

      hiddenHand[i] = rankNo.toString()+suitS;;
    }
    hiddenHand = hiddenHand.toString();

    var dealerHandVal = "; Value of hand: "+this.handVal(gameDealer.hand);

    //print the dealers hand, all cards except the first
    document.getElementById("p1").innerHTML = hiddenHand;

    if(flag)
    {
        document.getElementById("p1").innerHTML = hiddenHand + dealerHandVal; 
    }

  console.log("Players Hand");
  console.log("Players Hand length: "+gamePlayer.hand.length);
    //print the players hand, all cards
    var playerHand =[];
    for(var i=0; i<gamePlayer.hand.length; i++) //print players hand
    {
      var tempCard = gamePlayer.hand[i];
      var rankNo = tempCard.rank;
      var suitS = tempCard.suit;

      if(rankNo == 11)
      {
        rankNo = "J";
      }else if(rankNo == 12)
      {
        rankNo = "Q"
      }else if(rankNo == 13)
      {
        rankNo = "K";
      }else if(rankNo == 1)
      {
        rankNo = "A";
      }

      console.log("value of the card: "+rankNo);

      playerHand[i] = rankNo.toString()+suitS;
    }

    var playerHandVal = "; Value of hand: "+this.handVal(gamePlayer.hand);
    document.getElementById("p2").innerHTML = playerHand.toString()+playerHandVal;

  }
}

/*
	@Pre: rank and suit are passed in
	@Post: A card object is created
	@Return: None
*/
function Card(r, s)
{
  this.rank = r;
  this.suit = s;
}

/*
	@Pre: None
	@Post: A deck object is created
	@Return: None
*/
function Deck()
{
  this.cardArr = [];
  this.loaded = false;

  /*
  	@Pre: A deck exists
  	@Post:the deck is loaded with 52 cards
  	@Return: None
  */
  this.initialize = function()
  {
    this.cardArr = [];
    var newCard;
    for(var i = 1; i<=13; i++ )
    {
      for(var j = 0; j<4; j++)
      {
        if(j == 0)
        {
          newCard = new Card(i, "&#9824");
          this.cardArr.push(newCard);

        }else if(j == 1)
        {
          newCard = new Card(i, "&#9829");
          this.cardArr.push(newCard);

        }else if(j == 2)
        {
          newCard = new Card(i, "&#9830");
          this.cardArr.push(newCard);

        }else if(j == 3)
        {
          newCard = new Card(i, "&#9827");
          this.cardArr.push(newCard);
        }
      }
    }
    this.loaded = true;
  }

  /*
  	@Pre: the deck is loaded
  	@Post: the deck array is randomized
  	@Return: None
  */
  this.shuffle = function()
  {
    //console.log("Size of the deck: "+this.cardArr.length);
    if (this.loaded == true)
    {
      var index1;
      var index2;
      var temp;
      for(var i = 0; i<100; i++) //perform 100 random shuffles
      {
        var index1 = Math.floor(Math.random()*52);
        var index2 = Math.floor(Math.random()*52); //get two random indexes

      //  console.log("Swapping index: "+index1+" with index "+ index2 )
        //console.log( "This swaps the: "+this.cardArr[index1].suit +" of "+ this.cardArr[index1].rank +" with the "+this.cardArr[index2].suit + " of " +this.cardArr[index2].rank);
        temp = this.cardArr[index1];
        this.cardArr[index1] = this.cardArr[index2];
        this.cardArr[index2] = temp;
      }
    }

    for(var i = 0; i<52; i++)
    {
      console.log(this.cardArr[i].rank + this.cardArr[i].suit);
    }
  }
}

/*
* Notes:
* ties means neither player wins
* Dealer hits to at least 17
* If neither player has a natural blackjack, player goes first
* then the dealer procedes
* when both players are standing, the hand ends and check to see who has the higher hand
* if the player busts, the game ends and he/she loses
* if the player doesn't bust, and the dealer busts, game ends and the player wins
*/
