//Possible classes: Cards, Deck, hand, player, dealer, game
var gameDeck = new Deck();	//Deck object
var gameDealer = new Dealer()

function Dealer()
{
    this.hand = [];
}

function Player()
{
  this.hand = [];
}


function game()
{
  //initialize Deck
  gameDeck.initialize();

  //shuffle Deck
  gameDeck.shuffle();

  //deal two cards to the dealer and player

}

function Card(r, s)
{
  this.rank = r;
  this.suit = s;
}

function Deck()
{
  this.cardArr = [];
  this.loaded = false;

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
