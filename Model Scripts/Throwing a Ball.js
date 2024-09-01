// Simulating Forces
// The Nature of Code
// The Coding Train / Daniel Shiffman
// https://youtu.be/Uibl0UE4VH8
// https://thecodingtrain.com/learning/nature-of-code/2.1-simulating-forces.html
// https://editor.p5js.org/codingtrain/sketches/kYWcOmch

class Mover {
  constructor(x, y, m) {
    this.dragging = false; // Is the object being dragged?
    this.rollover = false; // Is the mouse over the ellipse?
    this.offset = createVector();
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.mass = m;
    this.r = sqrt(this.mass) * 16;
    this.angle = 0;
    this.angleV = 0;
    this.prev = createVector();
  }

  over(x, y) {
    // Is mouse over object
    this.rollover = dist(x, y, this.pos.x, this.pos.y) < this.r;
    return this.rollover;

  }


  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }


  edges() {
    if (this.pos.y >= height - this.r) {
      this.pos.y = height - this.r;
      this.vel.y *= -0.95;
    }

    if (this.pos.x >= width - this.r) {
      this.pos.x = width - this.r;
      this.vel.x *= -0.95;
    } else if (this.pos.x <= this.r) {
      this.pos.x = this.r;
      this.vel.x *= -0.95;
    }
  }


  update() {

    // let mouse = createVector(mouseX, mouseY);
    // this.acc = p5.Vector.sub(mouse, this.pos);
    // this.acc.setMag(0.1);

    if (this.dragging) {
      this.prev.lerp(this.pos, 0.1);
      this.pos.x = mouseX + this.offset.x;
      this.pos.y = mouseY + this.offset.y;
      this.vel.set(0,0);
    }

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
    this.angleV = this.vel.x * 0.05;    
    this.angle += this.angleV;
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    stroke(255);
    strokeWeight(2);
    if (this.dragging) {
      fill(255, 50);
    } else if (this.rollover) {
      fill(255,100);
    } else {
      fill(255, 150);
    }
    rotate(this.angle);
    ellipse(0, 0, this.r * 2);
    strokeWeight(4);
    line(0,0, this.r,0);
    pop();
  }


  pressed(x, y) {
    // Did I click on the rectangle?
    if (this.over(x, y)) {
      this.dragging = true;
      // If so, keep track of relative location of click to corner of rectangle
      this.offset.set(this.pos.x - mouseX, this.pos.y - mouseY);
    }
  }

  released() {
    // Quit dragging
    this.dragging = false;
    this.vel.x = this.pos.x - this.prev.x;
    this.vel.y = this.pos.y - this.prev.y;
    this.vel.mult(0.1);
  }
}
