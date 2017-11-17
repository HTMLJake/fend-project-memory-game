/* Card List */
let cards = [];
$('.deck .card').each(function () {
    cards.push(this);
});

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

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
 *  + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *  + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

let flippedCardsArr = [];

 //Card Event Listener
$('.card').click(function () { 
    showCard(this);
    toArray(this);
});

//add card to flipped card array
function toArray (card) {
    flippedCardsArr.push(card);
}

function matchTest(cardsArr) {
    //test if the cards i element has the same class
    if ($(cardsArr[0]).children().attr("class") == $(cardsArr[1]).children().attr("class")) {
        holdCards(cardsArr);
    } else {
        //Shakes and hide cards if they do not match
        cardsArr.forEach(card => {
            $(card).effect("shake", {}, 500, function() {
                hideCard(card,function(){});
            });
        });
    }
}

//Sets cards to the hold class if matched
function holdCards(cardsArr) {
    for (const card of cardsArr) {    
        $(card).effect("bounce", {}, 300, function() {
            $(card).addClass('match');
        });
    }
}

//Shakes card and shows image
function showCard(card) {
    if($(card).attr("class") == "card open show") {return;}
    $(card).toggle("clip", {direction: "horizontal"}, 100, function() {
        $(card).addClass('open show');
        $(card).toggle("clip", {direction: "horizontal"}, 100, function () {
            //tests if there are two cards after they are visible
            if (flippedCardsArr.length == 2) {
                matchTest(flippedCardsArr)
                flippedCardsArr.splice(0,2);
            }
        });
    });
}


function hideCard(card, func) {
    $(card).toggle("clip", {direction: "horizontal"}, 100, function() {
        $(card).removeClass('open show match');
        $(card).toggle("clip", {direction: "horizontal"}, 100, function (){
            //exits if sec param is not a function
            if(typeof func != "function") { return; }
            func();
        });
    });
}

/* Restart Game when Restart Button Pressed */
$('.restart').click(function () {
    Restart();
});

function Restart() {
    let classArr = cards.map(x => $(x).find("i").attr("class"));
    
    shuffle(classArr);
    
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        if($(card).attr("class") == "card open show match") {
            hideCard(card, function () {
                $(card).find('i').attr("class", classArr[i]); 
            }); 
        } else {
            $(card).find('i').attr("class", classArr[i]);
        }
    }
}
Restart();
