const listOfCards = [`fa-diamond`,`fa-paper-plane-o`,`fa-anchor`,`fa-bolt`,`fa-cube`,`fa-anchor`,`fa-leaf`,`fa-bicycle`,`fa-diamond`,`fa-bomb`,`fa-leaf`,`fa-bomb`,`fa-bolt`,`fa-bicycle`,`fa-paper-plane-o`,`fa-cube`];
const deck  = document.querySelector (`.deck`);
const arrayOfLis = document.querySelectorAll (`.card`);
let bntRenew = document.querySelector (`.restart`);
const stars = document.querySelectorAll (`.stars li`);
const audio = document.getElementById (`audio`);
let scnds = 0, mnts = 0;
let listOfOpened = []; 
let clickprevent = true;
let numberMoves = 0;
let startTimer = 1;
let tmrVar;
let rating = 3;

//Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
// show a card - adds class "show" and "open"
function showCard (e) {
    e.target.classList.add (`open`);
    e.target.classList.add (`show`); 
};
// add second class name of an opened card to an array 
function addToOpened (e) {
    listOfOpened.push (e.target.querySelector (`.fa`).classList.item(1)); 
};
// fix in opened state showed cards - add class "match"
function fixOpenedCards () {
let liveShowed = document.getElementsByClassName (`show`);   
    for (let i = 0; i < liveShowed.length; i++) {
        liveShowed[i].classList.add (`match`);
    };
};
// close cards - removes "open" and "show" classes
function closeCard () {
    listOfOpened = [];
    let allShowed = document.querySelectorAll (`.show`);
    for (let i = 0; i < allShowed.length; i++) {
        allShowed[i].classList.remove (`show`);
        allShowed[i].classList.remove (`open`);
    };
    clickprevent = true;
};
// rewrite deck
function newDeck () {
// clean old content
    deck.textContent = ``;
// clean array of opened cards
    listOfOpened = [];
// loop through each card and create its HTML
    for (const ind in listOfCards) {
        const card = `<li class="card">
        <i class="fa ${listOfCards[ind]}"></i>
        </li>`;
// add each card's HTML to the page
        deck.insertAdjacentHTML (`beforeend`, card);
    };
// renew stars and "moves"
    stars[0].style.visibility = `visible`;
    stars[1].style.visibility = `visible`;
    document.querySelector (`.word`).textContent = `Moves`;
};
// count moves and update starss
function movesCount () {
    numberMoves ++;
    document.querySelector (`.moves`).textContent = numberMoves;
// hide stars by one
    if (numberMoves > 9) {
        stars[0].style.visibility = `hidden`;
        rating = 2;
    }
    if (numberMoves > 18) {
        stars[1].style.visibility = `hidden`;
        rating = 1;
    }
// if it just 1 move
    if (numberMoves === 1) {
        document.querySelector (`.word`).textContent = `Move`;
    } else {
        document.querySelector (`.word`).textContent = `Moves`;
    }
};
// for renew
function renewBtn () {
    shuffle (listOfCards);
    newDeck ();
    numberMoves = 0; 
    document.querySelector (`.moves`).textContent = numberMoves;
    rating = 3;
    startTimer = 1;
    scnds = 0;
    mnts = 0;
};
// create a message when all cards have matched
function endGame () {
    if (document.getElementsByClassName (`match`).length === listOfCards.length) {
        /* swal({
            heightAuto: false,
            title: `Congratulations! You have won the game!`,
            text: `Your time was ${mnts} : ${scnds}. Your star rating was ${rating}. Do you want to play again?`,
            showConfirmButton: true,
            timer: 5000
        }); */
        swal({
            heightAuto: false,
            title: `Congratulations! You have won the game!`,
            text: `Your time was ${mnts} : ${scnds}. Your star rating was ${rating}. Do you want to play again?`,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, play again'
          }).then((result) => {
            if (result.value) {
                renewBtn ();
            }
        });
        clearInterval(tmrVar);
    };
};
// for timer
function tmr () {
    scnds ++;
    if (scnds === 60) {
        scnds = 0;
        mnts ++;
        if (mnts === 60) {
            mnts = 0;
        }
    } 
    document.querySelector (`.timer`).textContent = `${mnts} : ${scnds}`;
}
// shuffle cards every time as a page opened or renewed
shuffle (listOfCards);
// and rewrite deck
newDeck ();
document.querySelector (`.moves`).textContent = numberMoves;

// if button "Renew" pressed
bntRenew.addEventListener (`click`, renewBtn);

// the event listener for a card. If a card is clicked:
deck.addEventListener (`click`, function (e) {
    if (e.target.nodeName === `LI`) {
        if (clickprevent && !(e.target.classList.contains (`open`) || e.target.classList.contains (`match`))) {
            if (startTimer) {
               tmrVar = setInterval(tmr, 1000); 
               startTimer = 0;
            }
// some music just for fun, after click because of autoplay policy
            audio.play ();
// display the card's symbol
            showCard (e);
// add the card to a *list* of "open" cards 
            addToOpened (e);
// if the list already has another card, check to see if the two cards match
            if (listOfOpened.length === 2) {
// increment the move counter and display it on the page
                movesCount ();
                if (listOfOpened [0] === listOfOpened [1]) {
// if the cards do match, lock the cards in the open position
                    fixOpenedCards ();
                    listOfOpened = [];
// if the cards do not match, remove the cards from the list and hide the card's symbol
                }  else {
                    clickprevent = false;
                    setTimeout (closeCard, 1000)
                };
            }     
// if all cards have matched, display a message with the final score
            endGame ();
// start the timer
        }
    }
});

audio.addEventListener ("ended", function () {
audio.play ();
});
