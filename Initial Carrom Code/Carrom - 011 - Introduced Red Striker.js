let movers = [];
let striker;

function setup() {
  createCanvas(450, 450);
  for (let i = 0; i < 8; i++) {
    movers.push(new Mover());
  }
  striker = new Striker();
}

function draw() {
  background(205);
  
  striker.update();
  striker.checkEdges();
  striker.show();
  
  for (let i = 0; i < movers.length; i++) {
    movers[i].update();
    movers[i].checkEdges();
    movers[i].show();
    
    // Check collisions with striker
    if (dist(striker.position.x, striker.position.y, 
             movers[i].position.x, movers[i].position.y) <= (striker.size + 18) / 2) {
      handleCollision(striker, movers[i]);
    }
    
    // Check collisions with other movers
    for (let j = i + 1; j < movers.length; j++) {
      if (dist(movers[i].position.x, movers[i].position.y, 
               movers[j].position.x, movers[j].position.y) <= 25) {
        handleCollision(movers[i], movers[j]);
      }
    }
  }
}

class Mover {
  constructor() {
    this.position = createVector(random(width), random(height));
   // this.velocity = createVector(random(-4, 4), random(-4, 4));
   this.velocity = createVector(8,-8);

    this.damping = 0.99;
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.mult(this.damping);
  }

  show() {
    stroke(0);
    strokeWeight(2);
    fill(127);
    circle(this.position.x, this.position.y, 18);
  }

  checkEdges() {
    if (this.position.x > width - 12.5) {
      this.position.x = width - 12.5;
      this.velocity.x *= -1;
    } else if (this.position.x < 12.5) {
      this.position.x = 12.5;
      this.velocity.x *= -1;
    }
    if (this.position.y > height - 12.5) {
      this.position.y = height - 12.5;
      this.velocity.y *= -1;
    } else if (this.position.y < 12.5) {
      this.position.y = 12.5;
      this.velocity.y *= -1;
    }
  }
}

class Striker extends Mover 
{
  constructor() 
  {
    super();
    this.size = 35;
  }

  show() {
    stroke(0);
    strokeWeight(2);
    fill(255, 0, 0);  // Red color to distinguish the striker
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

  // Move balls apart to prevent sticking
  let midpoint = p5.Vector.add(mover1.position, mover2.position).div(2);
  let d = p5.Vector.dist(mover1.position, mover2.position);
  if (d > 0) {
    let correction = (25 - d) / 2;
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