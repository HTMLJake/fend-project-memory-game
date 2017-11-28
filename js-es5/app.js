'use strict';

/* Timer (not acurate, can be affected by lag) */
var timer = 0;

var secs = '00';
var mins = '00';

var time;
var readout;

function startTimer() {
    time = window.setInterval(function () {
        secs = (timer < 10 ? '0' : '') + timer++;
        if (timer == 60) {
            mins = (mins < 10 ? '0' : '') + mins++;
            timer = 0;
        }
        readout = mins + ':' + secs;
        $('.timer').text(readout);
    }, 1000);
}

function stopTimer() {
    window.clearInterval(time);
}

function clearTimer() {
    stopTimer();
    secs = '00', mins = '00';
    readout = mins + ':' + secs;
    $('.timer').text(mins + ':' + secs);
}

/* Card List */
var cardsArr = [];
var flippedCardsArr = [];
var starsArr = [];

var victoryResult = false;
var isStart = false;

var moveIndex = 0;
var cardFlipSpeed = 50;

//creates array of card objects
$('.deck .card').each(function () {
    cardsArr.push(this);
});

$('.stars').children().each(function () {
    starsArr.push($(this).children());
});

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
    $(".result-panel").hide();
    Restart();
    toggleDeckVisability();
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
    var result = false;
    if (!$(card).attr("class").includes("match")) {
        if (flippedCardsArr[0] !== card || flippedCardsArr[0] === null) {
            flippedCardsArr.push(card);
            result = true;
        }
    }
    return result;
}
//Shows results on Victory
function showResults() {
    setTimeout(function () {
        $('.moves').text(moveIndex);
        $('.score').html($('.stars').html());
        $('.finalTime').text(readout);
        toggleDeckVisability();
        $('.result-panel').show();
    }, 2000);
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
    $("#game-panel").toggle();

    /* if (isVictory()) {
        $("#game-panel").hide();
    } else {
        $("#game-panel").show();
    } */
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
    for (var i = 0; i < starsArr.length; i++) {

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
        cardsArr.forEach(function (card) {
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
var isVictory = function isVictory() {
    var i = 0;
    cardsArr.forEach(function (card) {
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
    var _loop = function _loop(card) {
        $(card).effect("bounce", {}, 300, function () {
            $(card).addClass('match');
            //$(card).removeClass('open show');
            if (isVictory()) {
                stopTimer();
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
    $(card).toggle("clip", {
        direction: "horizontal"
    }, cardFlipSpeed, function () {
        $(card).addClass('open show');
        $(card).toggle("clip", {
            direction: "horizontal"
        }, cardFlipSpeed, function () {
            //Checking if there are two cards in the array once the animation is complete
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
    clearTimer();
    updateMoveIndex(0);
    isStart = false;
    //get array of icon classes
    var classArr = cardsArr.map(function (x) {
        return $(x).find("i").attr("class");
    });
    //shuffle classes array
    shuffle(classArr);
    //set new classes from shuffle

    var _loop2 = function _loop2(i) {
        var card = cardsArr[i];
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

    for (var i = 0; i < cardsArr.length; i++) {
        _loop2(i);
    }
}
//run restart function when site loads
Restart();