
let whiteMovers = [];
let blackMovers = [];
let striker;
let queen;
let carromwidth=450;
let carromheight=450;
let rectangleX = 100;
let rectangleY = 350;
let rectangleWidth = 250;
let rectangleHeight = 35;
let strikerX = rectangleX + rectangleWidth / 2;
let strikerY = rectangleY + rectangleHeight / 2;

function setup() {
  createCanvas(450, 450);
  
  
  for (let i = 0; i < 9; i++) 
    {
    blackMovers.push(new BlackMover());
    whiteMovers.push(new WhiteMover());
  }
  striker = new Striker();
  queen = new Queen();
}

function draw() 
{
  background(205);
  fill('#bfe693');
  rect(100, 350, 250, 35, 20);
  fill(195, 195, 195);
  circle(carromwidth/2,carromheight/2,175);
  circle(carromwidth/2,carromheight/2,20);
  if (mouseIsPressed) {
    striker.setVelocity();
  }
  
  let allMovers = [striker, queen, ...whiteMovers, ...blackMovers];
  
  for (let i = 0; i < allMovers.length; i++) {
    allMovers[i].update();
    allMovers[i].checkEdges();
    allMovers[i].show();
    
    // Check collisions with all other movers
    for (let j = i + 1; j < allMovers.length; j++) {
      if (dist(allMovers[i].position.x, allMovers[i].position.y, 
               allMovers[j].position.x, allMovers[j].position.y) <= (allMovers[i].size + allMovers[j].size) / 2) {
        handleCollision(allMovers[i], allMovers[j]);
      }
    }
  }
}

class Mover {
  constructor(x, y, size, color) {
    this.position = createVector(x || random(width), y || random(height));
    this.velocity = createVector(0,0);
    this.damping = 0.99;
    this.size = size || 18;
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
    if (this.position.x > width - this.size/2) {
      this.position.x = width - this.size/2;
      this.velocity.x *= -1;
    } else if (this.position.x < this.size/2) {
      this.position.x = this.size/2;
      this.velocity.x *= -1;
    }
    if (this.position.y > height - this.size/2) {
      this.position.y = height - this.size/2;
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
    super(x, y, 18, color(255));
  }
}

class BlackMover extends Mover {
  constructor(x, y) {
    super(x, y, 18, color(0));
  }
}

class Queen extends Mover {
  constructor(x, y) {
    super(x, y, 18, color(255, 0, 0));
  }
}

class Striker extends Mover {
  constructor(x, y) {
   super(x, y, 30, color(245, 245, 45));
    this.position.x = strikerX;
    this.position.y = strikerY;
    this.velocity = createVector(0, 0);
  }
   setVelocity() {
    let mouseVector = createVector(mouseX - this.position.x, mouseY - this.position.y);
    mouseVector.limit(10); // Limit the velocity to a maximum of 10
    this.velocity = mouseVector;
  }

   show() {
    super.show();
    if (mouseIsPressed) {
      stroke(255, 0, 0);
      line(this.position.x, this.position.y, mouseX, mouseY);
    }
  }
}
////////////////////////



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