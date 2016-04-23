/*
*	@author: Justin Lee
*	@date:	2017/04/16
*	@name:	blackjack.js
*/

//Possible classes: Cards, Deck, hand, player, dealer, game
var gameDeck = new Deck();	//Deck object
var gameDealer = new Dealer();  //Dealer object
var gamePlayer = new Player(); //player object


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

  /*
    @Pre: called from an HTML button press
    @Post:sets the players hit value to true whenever its called
    @Return: None
  */
  this.setHit = function()
  {
    this.hits = true;
  }

  /*
    @Pre: called from an html button
    @Post: set the stands variable to true
    @Return: None
  */
  this.setStands = function()
  {
    this.stands = true;
  }
}

/*
	@Pre: None
	@Post: A game object is created
	@Return: None
*/
function game() //maybe needs to take parameters of a deck, player, and dealer?, return true if player wins, false if dealer wins?
{
  alert("New Game buster douglas");
  //initialize Deck
  gameDeck.initialize();

  //shuffle Deck
  gameDeck.shuffle();

  //deal two cards to the player
  gamePlayer.hand.push(gameDeck.pop());
  gamePlayer.hand.push(gameDeck.pop());

  //deal two cards to the dealer
  gameDealer.hand.push(gameDeck.pop());
  gameDealer.hand.push(gameDeck.pop());

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


  //players turn
  do
  {
    alert("Hit or Stay");
    this.wait();  //wait until one of the buttons is pressed

    if(gamePlayer.hits == true)
    {
      this.gamePlayer.hits = false;
      gamePlayer.hand.push(gameDeck.pop());

      if((this.handVal(gamePlayer.hand))>21)  //player has busted
      {
        return(false);
      }
    }
  }while(((this.handVal(gamePlayer.hand))<22)&& (gamePlayer.stands == false)) //TODO: make a hits function


  //if stand, allow the computer to go

  if(this.handVal(gameDealer.hand)<17)//if dealers hand< 17 hit
  {
    gameDealer.hand.push(gameDeck.pop());

    if((this.handVal(gameDealer.hand))>21)  //Dealer has busted
    {
      return(false);
    }
  }else
  {
      gameDealer.stands = true;
  }

    //if stay, compare the two hands

    if((this.handVal(gamePlayer.hand))>(this.handVal(gameDealer.hand)))
    {
      return(true); //player wins
    }else((this.handVal(gamePlayer.hand))<(this.handVal(gameDealer.hand)))
    {
      return(false);  //dealer wins
    }else if(((this.handVal(gamePlayer.hand))==(this.handVal(gameDealer.hand))))
    {
      alert("The game is a tie");
    }

  /*
  	@Pre: the dealers or players hand array is passed in
  	@Post: The value of their hand is computed
  	@Return: The value of their hand
  */
  this.handVal = function(h)
  {
    var sum = 0;

    for(var i = 0; i< h.length; i++)
    {
      sum += h[i].rank;
    }

    return(sum);
  }

  /*
    @Pre: None
    @Post: the game pauses until the player either hits or stays
    @Return: None
  */
  this.wait = function()
  {
    if (!gamePlayer.hits && !gamePlayer.stands)
    {
      //TODO: get the state of the hit and stand button, write functions, maybe
      setTimeout(wait,3000);
    }
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
    for(var i = 1; i<13; i++ )
    {
      for(var j= 0; j<4; j++)
      {
        if(j == 0)
        {
          var newCard = new Card(i, "spades");
          this.cardArr.push(newCard);

        }else if(j == 1)
        {
          var newCard = new Card(i, "hearts");
          this.cardArr.push(newCard);

        }else if(j == 2)
        {
          var newCard = new Card(i, "diams");
          this.cardArr.push(newCard);

        }else if(j == 4)
        {
          var newCard = new Card(i, "clubs");
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
    if (this.loaded == true)
    {
      for(var i = 0; i<100; i++) //perform 100 random shuffles
      {
        var index1 = Math.floor(Math.random()*51);
        var index2 = Math.floor(Math.random()*51); //get two random indexes

        var temp = this.cardArr[index1];
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
