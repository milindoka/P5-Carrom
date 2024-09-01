// I used the angle free representation:
//  https://en.wikipedia.org/wiki/Elastic_collision#Two-dimensional_collision_with_two_moving_objects
// This allows us to use vectors to handle the angle calculations for us
// Note that I have added dotProduct, vectorMag, vectorSub and vectorMult
// These functions handle vectors as arrays of numbers 
// Lines 81-101 is where I implemented the collision handling 
// I left out the mass from the equation so this simulates balls of equal mass colliding

let ballx1 = 50;

let bally1 = 50;

let ballx2 = 550;

let bally2 = 350;

let sballx1 = 3;

let sbally1 = 2.1;

let sballx2 = -3.5;

let sbally2 = -2;



function setup() {

  createCanvas(600, 400);

}



function draw() {

  background(0);

  ballx1 += sballx1;

  bally1 += sbally1;

  ballx2 += sballx2;

  bally2 += sbally2;

  fill(255);

  if (ballx1 <= 25 || ballx1 >= 575){

    sballx1 *= -1;

  }

  if (bally1 <= 25 || bally1 >= 375){

    sbally1 *= -1;

  }

  if (ballx2 <= 25 || ballx2 >= 575){

    sballx2 *= -1;

  }

  if (bally2 <= 25 || bally2 >= 375){

    sbally2 *= -1;

  }

  if (dist(ballx1,bally1,ballx2,bally2) <= 50){

    background(255,0,0);
    let x1 = [ballx1, bally1];
    let x2 = [ballx2, bally2];
    let v1 = [sballx1, sbally1];
    let v2 = [sballx2, sbally2];

    
    let num1 = dotProduct(vectorSub(v1,v2), vectorSub(x1,x2));        // Numerator 1
    let num2 = vectorSub(x1,x2);                                      // Numerator 2
    let den1 = vectorMag(vectorSub(x1,x2))**2;                        // Denominator 1

    
    let num3 = dotProduct(vectorSub(v2,v1), vectorSub(x2,x1));        // Numerator 3
    let num4 = vectorSub(x2,x1);                                      // Numerator 4
    let den2 = vectorMag(vectorSub(x2,x1))**2;                        // Denominator 2

    let newv1 = vectorSub(v1, vectorMult(num2,(num1/den1)));
    let newv2 = vectorSub(v2, vectorMult(num4,(num3/den2)));
    
    // Update the velocities
    sballx1 = newv1[0];
    sbally1 = newv1[1];
    sballx2 = newv2[0];
    sbally2 = newv2[1];
    
    // Update the positions
    ballx1 += sballx1;
    bally1 += sbally1;
    ballx2 += sballx2;
    bally2 += sbally2;
  }

  circle(ballx1, bally1, 50);

  circle(ballx2, bally2, 50);

}


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