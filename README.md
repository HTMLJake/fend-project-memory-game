# Memory Game Project

## Table of Contents

* [About](#About)
* [Installing](#Installing)
* [Contributing](#Contributing)

## About

*This project is based on code for the [Udacity Memory Project](https://github.com/udacity/fend-project-memory-game) for the front-end web design course. This fork is my version of the game done for the class.* 

This project is a simple memory matching game. Flip over two cards by clicking on them, if the two cards match they will stay, if they do not match, they will flip back over. Try to flip over all the cards to win. If you win in less than 20 turns you will get 3 stars, more that 20 but less than 30 for two stars, and over 30 is one star. A timer will start when you click on the first card and stop when you match all the cards.


## Installing

I used [Babel](https://babeljs.io/) to make this project work on older browsers so make sure to run `npm install` to download the dependancies. Then run `npm run build` to run babel. To make changes to the code open the `js/app.js` file. It will automatically run everytime you save. If you do not want to use babel you can either change the html to use the `js/app.js` file or edit the js-es5/app.js file. Also any javascript file in the `js/` directory will be transpilled to the js-es5 directory.

## Contributing

This project was made for a Udacity project so I will not accept most pull requests. 
