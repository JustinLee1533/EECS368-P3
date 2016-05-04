/*
*	@author: Justin Lee
*	@date:	2017/04/16
*	@name:	blackjack.js
*/

//Possible classes: Cards, Deck, hand, player, dealer, game
var gameDeck = new Deck();	//Deck object
var gameDealer = new Dealer();  //Dealer object
var gamePlayer = new Player(); //player object
var gameGame = new game();
var playerLost = false;
var gameOver = false;


function playGame()
{
  gameGame.play();
}

function hit()
{
  gamePlayer.setHit();
}

function stay()
{
  gamePlayer.setStands();
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
function game() //maybe needs to take parameters of a deck, player, and dealer?, return true if player wins, false if dealer wins?
{
//  document.getElementById("p1").innerHTML = "No cards ";
//  document.getElementById("p2").innerHTML = "No cards ";

  this.play = function()
  {
    console.log("playing game");

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

    this.printHands();

    //check to see if either player has a blackjack
    if((this.handVal(gamePlayer.hand))==21 && (this.handVal(gamePlayer.hand) ==21)) //TODO: maybe code would be prettier with a busts function
    {
      //game is a tie, both players have natual black jack
      return("tie");
    }else if ((this.handVal(gamePlayer.hand))==21)
    {
      //player wins natural blackjack
      return(true);
    }else if (this.handVal(gamePlayer.hand) ==21)
    {
      //dealer wins natural blackjack
      return(false);
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
        this.printHands();

        if((this.handVal(gamePlayer.hand))>21)  //player has busted, gameover
        {
          playerLost = true;
          gameOver = true;
          this.printHands();
          alert("You lose");
          return(false);
        }else if((this.handVal(gamePlayer.hand))==21)//call stand for the player
        {
          alert("You have 21");
          this.stand();
        }
      }
    }

    /*
    	@Pre: called from stand(), the player has not lost the game
    	@Post: dealer hits until the value of its hand is at least 17, changes betting values
    	@Return: The value of their hand
    */
  this.stand = function()
  {
    if((playerLost == false)&&(gameOver == false))
    {
      //call dealer function
      while(this.handVal(gameDealer.hand)<17)//if dealers hand< 17 hit
      {
        gameDealer.hand.push(gameDeck.cardArr.pop());
        this.printHands();

        if((this.handVal(gameDealer.hand))>21)  //Dealer has busted, gameover
        {
          gameDealer.busts = true;
          gameOver = true;
        alert("dealer busts, you win");
          return(false);
        }

      }
        if((this.handVal(gamePlayer.hand))>(this.handVal(gameDealer.hand)))
        {
          gameOver = true;
          alert("You Win");
          return(true); //player wins
        }else if ((this.handVal(gamePlayer.hand))<(this.handVal(gameDealer.hand)))
        {
          gameOver = true;
          alert("You Lose");
          return(false);  //dealer wins
        }else if((this.handVal(gamePlayer.hand))==(this.handVal(gameDealer.hand)))
        {
          gameOver = true;
          alert("The game is a tie");
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
    console.log("this hand has "+arr.length+" cards");
    for(var i=0; i< arr.length; i++)
    {
      var tempVal = arr[i].rank;
      console.log("Value of card "+i+" is: "+arr[i].rank);
      if(tempVal>=10)
      {
        tempVal = 10;
      }
      sum += tempVal;
    }

    return(sum);
  }

  /*
    @Pre: None
    @Post: The two current hands are written to the HTML document
    @Return: None
  */
  this.printHands = function()
  {
    console.log("printing hands");

    var hiddenHand =[];
    hiddenHand[0] = "X";
    console.log("Dealers Hand");
    console.log("Dealers Hand length: "+gameDealer.hand.length);

    for(var i=1; i<gameDealer.hand.length; i++)
    {
      var tempCard = gameDealer.hand[i];
      var rankNo = tempCard.rank;
      var suitS = tempCard.suit;
      console.log("value of the card: "+rankNo);

      hiddenHand[i] = rankNo;
    }
    hiddenHand = hiddenHand.toString();

    var dealerHandVal = "; Value of hand: "+this.handVal(gameDealer.hand);

    //print the dealers hand, all cards except the first
    document.getElementById("p1").innerHTML = hiddenHand + dealerHandVal;


  console.log("Players Hand");
  console.log("Players Hand length: "+gamePlayer.hand.length);
    //print the players hand, all cards
    var playerHand =[];
    for(var i=0; i<gamePlayer.hand.length; i++)
    {
      var tempCard = gamePlayer.hand[i];
      var rankNo = tempCard.rank;
      console.log("value of the card: "+rankNo);

      playerHand[i] = rankNo;
    }

    var playerHandVal = "; Value of hand: "+this.handVal(gamePlayer.hand);
    document.getElementById("p2").innerHTML = playerHand.toString()+playerHandVal;

  }
}


/*
	@Pre: None
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
          newCard = new Card(i, "spades");
          this.cardArr.push(newCard);

        }else if(j == 1)
        {
          newCard = new Card(i, "hearts");
          this.cardArr.push(newCard);

        }else if(j == 2)
        {
          newCard = new Card(i, "diams");
          this.cardArr.push(newCard);

        }else if(j == 3)
        {
          newCard = new Card(i, "clubs");
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
        var index1 = Math.floor(Math.random()*51);
        var index2 = Math.floor(Math.random()*51); //get two random indexes

      //  console.log("Swapping index: "+index1+" with index "+ index2 )
        //console.log( "This swaps the: "+this.cardArr[index1].suit +" of "+ this.cardArr[index1].rank +" with the "+this.cardArr[index2].suit + " of " +this.cardArr[index2].rank);
        temp = this.cardArr[index1];
        this.cardArr[index1] = this.cardArr[index2];
        this.cardArr[index2] = temp;
      }
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
