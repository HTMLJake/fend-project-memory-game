/* Timer (not acurate, can be affected by lag) */
let timer = 0;

let secs = '00';
let mins = '00';

var time;

function startTimer () {
    time = window.setInterval(function(){
        secs = (timer < 10 ? '0' : '') + timer++;
        if(timer == 60) {
            mins = (mins < 10 ? '0' : '') + mins++;
            timer = 0;
        }
        $('.timer').text(`${mins}:${secs}`);
    }, 1000);
}

function stopTimer() {
    window.clearInterval(time);
}

function clearTimer() {
    stopTimer();
    secs = '00' , mins = '00;
    $('.timer').text(`${mins}:${secs}`);
}

/* Card List */
let cardsArr = [];
let flippedCardsArr = [];
let starsArr = [];

let victoryResult = false;
let isStart = false;

let moveIndex = 0;
const cardFlipSpeed = 50;

//creates array of card objects
$('.deck .card').each(function () {
    cardsArr.push(this);
});

$('.stars').children().each(function () {
    starsArr.push($(this).children());
})

//Card Event Listener
$('.card').click(function () {
    if (!isStart) {
        isStart = true;
        startTimer();
    }
    if (toArray(this)) {
        showCard(this);
    }
});

$('.start-over').click(function () {
    toggleDeckVisability();
    $(".result-panel").hide();
    Restart();
});

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/* TODO
 *  + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

//add card to flipped card array
function toArray(card) {
    let result = false;
    if (flippedCardsArr[0] !== card || flippedCardsArr[0] === null) {
        flippedCardsArr.push(card);
        result = true;
    }
    return result;
}
//Shows results on Victory
function showResults() {
    setTimeout(function () {
        toggleDeckVisability();
        $('.result-panel').show();
    }, 1000);
}

//tests if there are two cards. Use this function after the cards are visible
function hasTwoCards() {
    if (flippedCardsArr.length == 2) {
        matchTest(flippedCardsArr);
        flippedCardsArr.length = 0;
    }
}

//Hides the deck
function toggleDeckVisability() {
    if (isVictory()) {
        $("#game-panel").hide();
    } else {
        $("#game-panel").show();
    }
}

//Increases moves and updates display
function updateMoveIndex(num) {
    moveIndex = num;
    $('.moves').text(num);
    updateScore(num);
}

function updateScore(num) {
    if (num < 20) {
        //score is 3 stars
        setStars(3);
    } else if (num >= 20 && num < 30) {
        //score is 2 stars
        setStars(2);
    } else {
        //score is 1 star
        setStars(1);
    }
}

function setStars(starAmount) {
    for (let i = 0; i < starsArr.length; i++) {

        if (i < starAmount) {
            $(starsArr[i]).attr("class", "fa fa-star");
        } else {
            $(starsArr[i]).attr("class", "fa fa-star-o");
        }
    }
}

function matchTest(cardsArr) {
    //test if the cards i element has the same class
    if ($(cardsArr[0]).children().attr("class") == $(cardsArr[1]).children().attr("class")) {
        holdCards(cardsArr);
    } else {
        //Shakes and hide cards if they do not match
        cardsArr.forEach(card => {
            $(card).effect("shake", {}, 500, function () {
                hideCard(card, function () {});
            });
        });
    }
    updateMoveIndex(moveIndex + 1);
}
//
//If every card is set to match then victory condition is met and returns bool
//
var isVictory = function () {
    let i = 0;
    cardsArr.forEach(card => {
        if ($(card).attr("class").includes("match")) {
            i++;
            if (i == cardsArr.length) {
                victoryResult = true;
            } else {
                victoryResult = false;
            }
        } else {
            victoryResult = false;
        }

    });
    return victoryResult;
};


//Sets cards to the hold class if matched
function holdCards(cardsArr) {
    for (const card of cardsArr) {
        $(card).effect("bounce", {}, 300, function () {
            $(card).addClass('match');
            //$(card).removeClass('open show');
            if (isVictory()) {
                showResults();
            }
        });
    }
}

//Shakes card and shows image
function showCard(card) {
    if ($(card).attr("class").includes("match")) {
        return;
    }
    $(card).toggle("clip", {
        direction: "horizontal"
    }, cardFlipSpeed, function () {
        $(card).addClass('open show');
        $(card).toggle("clip", {
            direction: "horizontal"
        }, cardFlipSpeed, function () {
            hasTwoCards();
        });
    });
}


function hideCard(card, func) {
    $(card).toggle("clip", {
        direction: "horizontal"
    }, cardFlipSpeed, function () {
        $(card).removeClass('open show match');
        $(card).toggle("clip", {
            direction: "horizontal"
        }, cardFlipSpeed, function () {
            //Test if second parameter is a function
            if (typeof func == "function") {
                //runs input function
                func();
            }
        });
    });
}

/* Restart Game when Restart Button Pressed */
$('.restart').click(function () {
    Restart();
    clearTimer();
    isStart = false;
});

function Restart() {
    //set moves to 0
    updateMoveIndex(0);
    //get array of icon classes
    let classArr = cardsArr.map(x => $(x).find("i").attr("class"));
    //shuffle classes array
    shuffle(classArr);
    //set new classes from shuffle
    for (let i = 0; i < cardsArr.length; i++) {
        const card = cardsArr[i];
        //test if card is currently set face up
        if ($(card).attr("class").includes("match")) {
            //hide face up cards
            hideCard(card, function () {
                //then apply new class
                $(card).find('i').attr("class", classArr[i]);
            });
        } else {
            //apply new class to cards already face down
            $(card).find('i').attr("class", classArr[i]);
        }
    }
}
//run restart function when site loads
Restart();