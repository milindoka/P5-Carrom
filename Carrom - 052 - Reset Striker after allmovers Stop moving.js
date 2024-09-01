
let whiteMovers = [];
let blackMovers = [];
let striker;
let queen;
let coinSize = 22;
let strikerSize = 30;


let carromwidth=450;
let carromheight=450;
let rectangleX = 100;
let rectangleY = 350;
let rectangleWidth = 250;
let rectangleHeight = 35;
let strikerX = rectangleX + rectangleWidth / 2;
let strikerY = rectangleY + rectangleHeight / 2;
let enableslider=true;
let oppositeRectangleX = 100;
let oppositeRectangleY = 65; // Moved up to be above the carrom board
let oppositeSlider;
let currentTurn = 'bottom'; // 'bottom' or 'top'
let quenPocketed=false;
let whiteScore=0;
let blackScore=0;
let retainTurn = false;
////////////////
function setup() {
  createCanvas(460, 550);
  
  let centerX = carromwidth / 2;
  let centerY = carromheight / 2;
  
  // Place the queen at the center
  queen = new Queen(centerX, centerY);
  
  let moverSize = coinSize; // Diameter of a mover
  let queenSize = coinSize; // Diameter of the queen
  
  // First circle: 6 movers touching the queen
  let firstCircleRadius = (queenSize + moverSize) / 2;
  createCircleOfMovers(centerX, centerY, firstCircleRadius, 6);
  
  // Second circle: 12 movers
  let secondCircleRadius = firstCircleRadius + moverSize;
  createCircleOfMovers(centerX, centerY, secondCircleRadius, 12);
  
  // Outer circle: remaining movers
  let outerCircleRadius = secondCircleRadius + moverSize;
  let remainingMovers = 18 - (6 + 12); // Total movers - (first circle + second circle)
  createCircleOfMovers(centerX, centerY, outerCircleRadius, remainingMovers);
  
  striker = new Striker();
  // Create the slider
  let sliderWidth = rectangleWidth;
  let sliderX = (width - sliderWidth) / 2;
  slider = createSlider(rectangleX, rectangleX + rectangleWidth, strikerX);
  slider.position(sliderX, sliderY);
  slider.style('width', sliderWidth + 'px');
  
  // Create the opposite slider
  oppositeSlider = createSlider(oppositeRectangleX, oppositeRectangleX + rectangleWidth, strikerX);
  oppositeSlider.position(sliderX, oppositeRectangleY);
  oppositeSlider.style('width', sliderWidth + 'px');
  
  // Update the opposite slider position
  oppositeSlider.position(sliderX, oppositeRectangleY-55);
}
function createCircleOfMovers(centerX, centerY, radius, count) {
  let angleStep = TWO_PI / count;
  for (let i = 0; i < count; i++) {
    let angle = i * angleStep;
    let x = centerX + radius * cos(angle);
    let y = centerY + radius * sin(angle);
    
    if (i % 2 === 0) {
      whiteMovers.push(new WhiteMover(x, y));
    } else {
      blackMovers.push(new BlackMover(x, y));
    }
  }
}

function draw() 
{
  background(220);
  text('B:'+str(blackScore),400, 20);
  text('W:'+str(whiteScore), 10, 20);
  // Draw the carrom board rectangle with round corners and thick border
  push();
  translate(5, 50);
  strokeWeight(2);
  stroke(100, 70, 40); // Brown color for the border
  fill('#bfe693');
  rect(0, 0, carromwidth, carromheight,20); // 30 is the corner radius

  // Draw the pockets
  fill(0); // Black color for pockets
  let pocketSize = 32;
  let pocketOffset = 16; // Half of the pocket size
  circle(pocketOffset, pocketOffset, pocketSize); // Top-left pocket
  circle(carromwidth - pocketOffset, pocketOffset, pocketSize); // Top-right pocket
  circle(pocketOffset, carromheight - pocketOffset, pocketSize); // Bottom-left pocket
  circle(carromwidth - pocketOffset, carromheight - pocketOffset, pocketSize); // Bottom-right pocket

  
  fill('#bfe693');
  rect(100, 350, 250, 35, 20);
  fill(195, 195, 195);
  circle(carromwidth/2, carromheight/2, 175);
  circle(carromwidth/2, carromheight/2, 20);
  fill('#bfe693');
  rect(100, 350, 250, 35, 20);
  fill(195, 195, 195);
  circle(carromwidth/2, carromheight/2, 175);
  circle(carromwidth/2, carromheight/2, 20);
  // Draw the opposite rectangle
  fill('#bfe693');
  rect(oppositeRectangleX, oppositeRectangleY, rectangleWidth, rectangleHeight, 20);
  // Update striker position based on current turn
  if (enableslider) {
    if (currentTurn === 'bottom') {
      striker.position.x = slider.value();
      striker.position.y = rectangleY + rectangleHeight / 2;
    } else {
      striker.position.x = oppositeSlider.value();
      striker.position.y = oppositeRectangleY + rectangleHeight / 2;
    }
  }
 
  if (mouseIsPressed && !striker.isLaunched) {
    striker.setVelocity();
  }

  if (striker.isLaunched && allMoversStopped()) {
    striker.reset();
  }
  
  if(quenPocketed) {allMovers = [striker, ...whiteMovers, ...blackMovers];
  

  }
  else allMovers = [striker, queen, ...whiteMovers, ...blackMovers];
  
  for (let i = 0; i < allMovers.length; i++) {
    allMovers[i].update();
    allMovers[i].checkEdges();
    allMovers[i].show();
    // Check if mover is in a pocket
    if (isInPocket(allMovers[i])) {
      if (allMovers[i] instanceof Queen) {
        console.log("Queen pocketed!");
        quenPocketed = true;
        retainTurn = true;
        if (currentTurn === 'bottom') {
          whiteScore += 3;
        } else {
          blackScore += 3;
        }
      } else if (allMovers[i] instanceof WhiteMover) {
        console.log("White coin pocketed!");
        whiteMovers.splice(whiteMovers.indexOf(allMovers[i]), 1);
        whiteScore += 1;
        if (currentTurn === 'bottom') retainTurn = true;
        if (whiteMovers.length === 0) checkWinner('White');
      } else if (allMovers[i] instanceof BlackMover) {
        console.log("Black coin pocketed!");
        blackMovers.splice(blackMovers.indexOf(allMovers[i]), 1);
        blackScore += 1;
        if (currentTurn === 'top') retainTurn = true;
        if (blackMovers.length === 0) checkWinner('Black');
      }
      allMovers.splice(i, 1);
      continue;
    }
    // Check collisions with all other movers
    for (let j = i + 1; j < allMovers.length; j++) {
      if (dist(allMovers[i].position.x, allMovers[i].position.y, 
               allMovers[j].position.x, allMovers[j].position.y) <= (allMovers[i].size + allMovers[j].size) / 2) {
        handleCollision(allMovers[i], allMovers[j]);
      }
    }
  }

  pop();
}

function checkWinner(color) {
  let winner = '';
  if (whiteMovers.length === 0 && blackMovers.length === 0) {
    winner = currentTurn === 'bottom' ? 'White' : 'Black';
  } else {
    winner = color;
  }
  
  alert(winner + " player wins!");
  resetGame();
}

function resetGame() {
  whiteMovers = [];
  blackMovers = [];
  quenPocketed = false;
  whiteScore = 0;
  blackScore = 0;
  currentTurn = 'bottom';
  setup(); // Re-initialize the game
}
let isDraggingStriker = false;
function mousePressed() {
  if (isMouseOverStriker()) {

class Striker extends Mover {
  // ... existing code ...

  reset() {
    if (!retainTurn) {
      currentTurn = (currentTurn === 'bottom') ? 'top' : 'bottom';
    }
    retainTurn = false;  // Reset for the next turn

    if (currentTurn === 'bottom') {
      this.position.x = slider.value();
      this.position.y = rectangleY + rectangleHeight / 2;
    } else {
      this.position.x = oppositeSlider.value();
      this.position.y = oppositeRectangleY + rectangleHeight / 2;
    }
    this.velocity.set(0, 0);
    this.isLaunched = false;
    this.dragStart = null;
    enableslider = true;
  }
}    isDraggingStriker = true;
    enableslider = false;
    striker.dragStart = createVector(mouseX - 5, mouseY - 50);
  }
}

function isMouseOverStriker() {
  let strikerY = currentTurn === 'bottom' ? rectangleY + rectangleHeight / 2 : oppositeRectangleY + rectangleHeight / 2;
  let d = dist(mouseX - 5, mouseY - 50, striker.position.x, strikerY);
  return d <= striker.size / 2;
}

function mouseDragged() {
  if (isDraggingStriker) {
    striker.setVelocity();
  }
}
function mouseReleased() {
  if (isDraggingStriker && !striker.isLaunched) {
    striker.launch();
  }
  isDraggingStriker = false;
}

function isMouseOverStriker() {
  let d = dist(mouseX - 5, mouseY - 50, striker.position.x, striker.position.y);
  return d <= striker.size / 2;
}
class Mover {
  constructor(x, y, size, color) {
    this.position = createVector(x, y);
    this.position = createVector(x || random(width), y || random(height));
    this.velocity = createVector(0,0);
    this.damping = 0.9838;
    this.size = size || coinSize;
    this.color = color || color(127);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.mult(this.damping);
  }

  show() {
    stroke(0);
    strokeWeight(2);
    fill(this.color);
    circle(this.position.x, this.position.y, this.size);
  }



checkEdges() {
  if (this.position.x > carromwidth - this.size/2) {
    this.position.x = carromwidth - this.size/2;
    this.velocity.x *= -1;
  } else if (this.position.x < this.size/2) {
    this.position.x = this.size/2;
    this.velocity.x *= -1;
  }
  if (this.position.y > carromheight - this.size/2) {
    this.position.y = carromheight - this.size/2;
    this.velocity.y *= -1;
  } else if (this.position.y < this.size/2) {
    this.position.y = this.size/2;
    this.velocity.y *= -1;
  }
}

}
  ////////////////////////////////////////////
class WhiteMover extends Mover {
  constructor(x, y) {
    super(x, y, coinSize, color(255));
  }
}

class BlackMover extends Mover {
  constructor(x, y) {
    super(x, y, coinSize, color(0));
  }
}

class Queen extends Mover {
  constructor(x, y) {
    super(x, y, coinSize, color(255, 0, 0));
  }
}
////////////////////////////
class Striker extends Mover {
  constructor(x, y) {
    super(x, y, strikerSize, color(245, 245, 45));
    this.position.x = rectangleX + rectangleWidth / 2;
    this.position.y = rectangleY + rectangleHeight / 2;
    this.velocity = createVector(0, 0);
    this.dragStart = null;
    this.maxVelocity = 15;
    this.isLaunched = false;
    this.launchVelocity = createVector(0, 0);
  }

  setVelocity() {
    if (this.dragStart) {
      let currentPos = createVector(mouseX - 50, mouseY - 50);
      this.launchVelocity = p5.Vector.sub(this.dragStart, currentPos);
      this.launchVelocity.limit(this.maxVelocity);
    }
  }

  show() {
    super.show();
    if (isDraggingStriker && !this.isLaunched) {
      stroke(255, 0, 0);
      strokeWeight(5);
      let mousePos = createVector(mouseX - 50, mouseY - 50);
      let arrowVector = p5.Vector.sub(this.position, mousePos);
      let arrowEnd = p5.Vector.add(this.position, arrowVector);
      
      // Draw the arrow line
      line(this.position.x, this.position.y, arrowEnd.x, arrowEnd.y);
      
      // Draw arrowhead
      push();
      translate(arrowEnd.x, arrowEnd.y);
      rotate(arrowVector.heading());
      triangle(0, 0, -10, 5, -10, -5);
      pop();
    }
  }
    
  launch() {
    this.isLaunched = true;
    this.velocity = this.launchVelocity.copy();
  }

  update() {
    if (this.isLaunched) {
      super.update();
    }
  }

  
  reset() {
    if (!retainTurn) {
      currentTurn = (currentTurn === 'bottom') ? 'top' : 'bottom';
    }
    console.log("Current turn: " + currentTurn);
    console.log("Retain turn: " + retainTurn);

    if (currentTurn === 'bottom') {
      this.position.x = slider.value();
      this.position.y = rectangleY + rectangleHeight / 2;
    } else {
      this.position.x = oppositeSlider.value();
      this.position.y = oppositeRectangleY + rectangleHeight / 2;
    }
    this.velocity.set(0, 0);
    this.isLaunched = false;
    this.dragStart = null;
    enableslider = true;
    retainTurn = false;  // Reset for the next turn
  }
}
function isInPocket(mover) {
  let pocketSize = 32;
  let pocketOffset = 16;
  let pockets = [
    {x: pocketOffset, y: pocketOffset},
    {x: carromwidth - pocketOffset, y: pocketOffset},
    {x: pocketOffset, y: carromheight - pocketOffset},
    {x: carromwidth - pocketOffset, y: carromheight - pocketOffset}
  ];

  for (let pocket of pockets) {
    if (dist(mover.position.x, mover.position.y, pocket.x, pocket.y) < pocketSize / 2) {
      return true;
    }
  }
  return false;
}



function handleCollision(mover1, mover2) {
  let x1 = [mover1.position.x, mover1.position.y];
  let x2 = [mover2.position.x, mover2.position.y];
  let v1 = [mover1.velocity.x, mover1.velocity.y];
  let v2 = [mover2.velocity.x, mover2.velocity.y];

  let num1 = dotProduct(vectorSub(v1,v2), vectorSub(x1,x2));
  let num2 = vectorSub(x1,x2);
  let den1 = vectorMag(vectorSub(x1,x2))**2;

  let num3 = dotProduct(vectorSub(v2,v1), vectorSub(x2,x1));
  let num4 = vectorSub(x2,x1);
  let den2 = vectorMag(vectorSub(x2,x1))**2;

  let newv1 = vectorSub(v1, vectorMult(num2,(num1/den1)));
  let newv2 = vectorSub(v2, vectorMult(num4,(num3/den2)));

  mover1.velocity.set(newv1[0], newv1[1]);
  mover2.velocity.set(newv2[0], newv2[1]);

 // Move objects apart to prevent sticking
 let midpoint = p5.Vector.add(mover1.position, mover2.position).div(2);
 let d = p5.Vector.dist(mover1.position, mover2.position);
 if (d > 0) {
   let minDistance = (mover1.size + mover2.size) / 2;
   let correction = (minDistance - d) / 2;
   let direction = p5.Vector.sub(mover1.position, mover2.position).normalize();
   mover1.position.add(direction.mult(correction));
   mover2.position.sub(direction.mult(correction));
  }
}



function allMoversStopped() {
  let allMovers = quenPocketed ? [striker, ...whiteMovers, ...blackMovers] : [striker, queen, ...whiteMovers, ...blackMovers];
  for (let mover of allMovers) {
    if (mover.velocity.mag() > 0.1) {
      return false;
    }
  }
  return true;
}



// Include the helper functions: dotProduct, vectorMag, vectorSub, vectorMult






function dotProduct(a,b){
  // Dot product of a*b (inner product/ scalar product)
  let product = 0;
  
  if (a.length !== b.length){
    return undefined;
  }
  else{
    for(let i = 0; i < a.length; i++){
      product += a[i]*b[i];
    }
    return product; // this is a scalar (just a number)
  }
}

function vectorMag(v){
  // Vector magnitude
  let mag = 0;
  for(let i of v){
    mag += i**2
  }
  return sqrt(mag); // this is also a scalar
}

function vectorSub(a,b){
  // Subtracts vector b from vector a
  let sub = []
  
  if (a.length !== b.length){
    return undefined;
  }
  else{
    for(let i = 0; i < a.length; i++){
      sub[i] = a[i]-b[i];
    }
    return sub; // this is a vector
  }
}

function vectorMult(v,s){
  // Multiplies vector (v) by scalar (s)
  let mult = [];
  for(let i = 0; i < v.length; i++){
    mult[i] = v[i]*s;
  }
  return mult; // This is also a vector
}

let slider;
let sliderY = 515; // Position of the slider below the carrom board