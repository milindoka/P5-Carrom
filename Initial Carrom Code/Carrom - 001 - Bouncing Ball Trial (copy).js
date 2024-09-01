var x = 0;
var y = 200;
var speed = 3;
var speedY = 4;

function setup() {
	createCanvas(400, 400);
}

function draw() {
	background(220);
	ellipse(x, y, 25, 25);
	x += speed;
	y += speedY;

	if (x > width || x < 0) {
		speed *= -1;
	}
	// if the ball hits the top or the bottom, change the direction of the ball 	
	if (y > height || y < 0) {
		speedY *= -1;
	}

	//Paddle
	rect(mouseX, height - 40, 100, 30);
}