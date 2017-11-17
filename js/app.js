/* Card List */
let cards = [];
$('.deck .card').each(function (e) {
    cards.push(this);
});

console.log(cards);
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

 //Card Event Listener
$('.card').click(function (e) { 
    e.preventDefault();
    showCard(this);
});

//Shakes card and shows image
function showCard(card) {
    $(card).toggle("clip", {direction: "horizontal"}, 100, function() {
        $(card).addClass('open show');
        $(card).toggle("clip", {direction: "horizontal"}, 100);
    });

    //TODO: Add to array of flipped cards
}

function hideCard(card) {
    $(card).toggle("clip", {direction: "horizontal"}, 100, function() {
        $(card).removeClass('open show');
        $(card).toggle("clip", {direction: "horizontal"}, 100);
    });

    //TODO: Clear array of flipped cards
}

/* Restart Game when Restart Button Pressed */
$('.restart').click(function (e) {
    let classArr = cards.map(x => $(x).find("i").attr("class"));

    shuffle(classArr);

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        $(card).attr("class", "card");
        $(card).find('i').attr("class", classArr[i]);
    }
});
