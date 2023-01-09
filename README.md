# John Conway's Game of Life in React/Next.js

<img src="/public/images/screenshotMain.png">

## About

This version of my Game of Life is written with React, Next.js, as well as Chakra UI which is what handles the styling. This site was intended to be a place to play the actual game as well as learn for those who have not heard of it. I originally attempted to make the site using just React, however when implementing the board, major performance issues arose mainly due to the fact that I was not using a graphics library and so I switched over to Next.js. I found more success with the Next.js iteration, however there are performance constraints that limit my ability to create the experience that I want. So, for my next iteration I am going to attempt to create the site using Javascript or Typescript and draw on the canvas element to achieve the performance that I want.

## Install and Run

To install this version of the site, clone the repo using:

```
git clone https://github.com/calgui1/game-of-life.git
cd game-of-life
npm install
npm run dev
```

Running the last command will start a development instance in the localhost port specified.

## More Screenshots
<img src="/public/images/screenshotRules.png">
<img src="/public/images/screenshotAbout.png">
<img src="/public/images/screenshotPatterns.png">
