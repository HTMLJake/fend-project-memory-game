'use strict';

/* Card List */
var cards = [];
var flippedCardsArr = [];
var moveIndex = 0;
var victoryResult = false;
var cardFlipSpeed = 50;

//creates array of card objects
$('.deck .card').each(function () {
    cards.push(this);
});

//Card Event Listener
$('.card').click(function () {
    showCard(this);
    toArray(this);
});

$('.start-over').click(function () {
    toggleDeckVisability();
    $(".result-panel").hide();
    Restart();
});

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

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
    flippedCardsArr.push(card);
}
//Shows results on Victory
function showResults() {
    setTimeout(function () {
        toggleDeckVisability();
        $('.result-panel').show();
    }, 1000);
}

//tests if there are two cards. Use after they are visible
function hasTwoCards() {
    if (flippedCardsArr.length == 2) {
        matchTest(flippedCardsArr);
        flippedCardsArr.length = 0;
    }
}

//Hides the deck
function toggleDeckVisability() {
    $(".deck").toggle("fade");
}

//Increases moves and updates display
function updateMoveIndex(num) {
    moveIndex = num;
    $('.moves').text(num);
}

function matchTest(cardsArr) {
    //test if the cards i element has the same class
    if ($(cardsArr[0]).children().attr("class") == $(cardsArr[1]).children().attr("class")) {
        holdCards(cardsArr);
    } else {
        //Shakes and hide cards if they do not match
        cardsArr.forEach(function (card) {
            $(card).effect("shake", {}, 500, function () {
                hideCard(card, function () {});
            });
        });
    }
    updateMoveIndex(moveIndex + 1);
}

//If every card is set to match then victory condition is met
var isVictory = function isVictory() {
    var i = 0;
    cards.forEach(function (card) {
        if ($(card).attr("class").includes("match")) {
            i++;
            if (i == cards.length) {
                victoryResult = true;
            } else {
                victoryResult = false;
            }
        }
    });
    console.log(victoryResult);
    return victoryResult;
};

//Sets cards to the hold class if matched
function holdCards(cardsArr) {
    var _loop = function _loop(card) {
        $(card).effect("bounce", {}, 300, function () {
            $(card).addClass('match');
            //$(card).removeClass('open show');
            if (isVictory()) {
                showResults();
            }
        });
    };

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = cardsArr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var card = _step.value;

            _loop(card);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
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
});

function Restart() {
    //set moves to 0
    updateMoveIndex(0);
    //get array of icon classes
    var classArr = cards.map(function (x) {
        return $(x).find("i").attr("class");
    });
    //shuffle classes array
    shuffle(classArr);
    //set new classes from shuffle

    var _loop2 = function _loop2(i) {
        var card = cards[i];
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
    };

    for (var i = 0; i < cards.length; i++) {
        _loop2(i);
    }
}
//run restart function when site loads
Restart();