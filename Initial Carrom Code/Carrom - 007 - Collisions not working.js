let movers = [];
// Declare an array to hold multiple Mover objects

function setup() {
  createCanvas(455,455);
  for (let i = 0; i < 8; i++) {
    movers[i] = new Mover();
  }
  // Create 8 Mover objects and store them in the array
}

function draw() {
  background(215);
  for (let i = 0; i < movers.length; i++) {
    for (let j = i + 1; j < movers.length; j++) {
      movers[i].checkCollision(movers[j]);
    }
    movers[i].update();
    movers[i].checkEdges();
    movers[i].show();
  }
}

class Mover {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = createVector(random(-8, 8), random(-8, 8));
    this.damping = 0.989;
    this.radius = 12.5; // Half of the circle's diameter
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.mult(this.damping);
    
    if (this.velocity.mag() < 0.01) {
      this.velocity.setMag(0);
    }
  }
  checkCollision(other) {
    let distance = p5.Vector.dist(this.position, other.position);
    let minDistance = this.radius + other.radius;
    
    if (distance < minDistance) {
      // Calculate normal vector
      let normal = p5.Vector.sub(this.position, other.position).normalize();
      
      // Calculate relative velocity
      let relativeVelocity = p5.Vector.sub(this.velocity, other.velocity);
      
      // Calculate velocity along the normal
      let velocityAlongNormal = p5.Vector.dot(relativeVelocity, normal);
      
      // Only resolve if objects are moving towards each other
      if (velocityAlongNormal < 0) {
        // Calculate impulse strength
        let restitution = 1.5; // Coefficient of restitution (bounce factor)
        let impulseStrength = -(1 + restitution) * velocityAlongNormal;
        
        // Apply impulse
        let impulse = p5.Vector.mult(normal, impulseStrength);
        this.velocity.add(impulse);
        other.velocity.sub(impulse);
        
        // Separate the circles
        let correction = (minDistance - distance) / 2;
        let separationVector = p5.Vector.mult(normal, correction);
        this.position.add(separationVector);
        other.position.sub(separationVector);
      }
    }
  }
  // ... existing show() and checkEdges() methods ...
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

  checkCollision(other) {
    let distance = p5.Vector.dist(this.position, other.position);
    if (distance < 25) {  // 25 is the diameter of our circles
      let normal = p5.Vector.sub(other.position, this.position).normalize();
      let relativeVelocity = p5.Vector.sub(this.velocity, other.velocity);
      let separatingVelocity = p5.Vector.dot(relativeVelocity, normal);
      
      if (separatingVelocity < 0) {
        let impulse = 2 * separatingVelocity / (1 + 1);  // Assuming equal mass
        let impulseVec = p5.Vector.mult(normal, impulse);
        
        this.velocity.sub(impulseVec);
        other.velocity.add(impulseVec);
      }
    }
  }
  
}