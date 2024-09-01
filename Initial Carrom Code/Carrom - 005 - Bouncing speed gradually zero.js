let mover;
//Declare the Mover object.

function setup() 
{
  createCanvas(450, 450);
  mover = new Mover();
//Create the Mover object.

  }

function draw()
 {
  background(205);
  mover.update();
  mover.checkEdges();
  mover.show();
//Call methods on the Mover object.
}

class Mover 
{
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = createVector(random(8, 9), random(-2, 2));
    this.damping = 0.989; // Add a damping factor
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.mult(this.damping); // Apply damping to velocity
    
    // Stop the ball if velocity becomes very small
    if (this.velocity.mag() < 0.01) {
      this.velocity.setMag(0);
    }
  }

  show()
   {
    stroke(0);
    strokeWeight(2);
    fill(127);
    circle(this.position.x, this.position.y, 25);
  }

 
  checkEdges() 
  {
    if (this.position.x > width) 
      {
      this.position.x = width;
      this.velocity.x *= -1;
    } else if (this.position.x < 0) 
      {
      this.position.x = 0;
      this.velocity.x *= -1;
    }
    if (this.position.y > height) 
      {
      this.position.y = height;
      this.velocity.y *= -1;
    } else if (this.position.y < 0)
       {
      this.position.y = 0;
      this.velocity.y *= -1;
     }
  }
  
}