class body{ // body is a class that represents a body in space
  static all = []; // Array that contains all the bodies in space
  static G = 6.67430e-11; // Gravitational constant
  
  constructor(x, y, z, mass, density) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.mass = mass;
    this.denisty = density;
    this.radius = this.GetRadius(this.mass, this.denisty);
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
    body.all.push(this);
  }
  
  GetRadius(mass, density) { return(Math.cbrt(mass/((3/4)*3.1416*density))); } // Returns the radius of the body
  GetDistance(other) { return(Math.sqrt((other.x-this.x)**2+(other.y-this.y)**2+(other.z-this.z)**2)); } // Returns the distance between two bodies

  applyGravity() { // Applies gravity to the body
    for (let i = 0; i < body.all.length; i++) {
      if (body.all[i] != this) {
        let distance = this.GetDistance(body.all[i]); // Distance between the two bodies
        if (distance < 1) { distance = 1; } // Prevents division by zero
        let force = (body.G*(body.all[i].mass)/(distance**2));  // Gravitational force between bodies
        let difVector = [(body.all[i].x-this.x)/distance, (body.all[i].y-this.y)/distance, (body.all[i].z-this.z)/distance]; // Vector pointing from this body to the other body, with a length of 1
        this.vx += force*difVector[0]*5000000;
        this.vy += force*difVector[1]*5000000;
        this.vz += force*difVector[2]*5000000;
      }
    }
  }

  static MovePlanets() {  // Moves all the planets
    for(let p of body.all) {
      p.MovePlanet();
    }
  }
  MovePlanet() {  // Moves the planet
    this.x += this.vx;
    this.y += this.vy;
    this.z += this.vz;
  }
  static DrawPlanets() {  // Draws all the planets
    for(let p of body.all) {
      p.DrawBody();
    }
  }
  DrawBody() { // Draws the body
    fill(200);
    translate(this.x, this.y, this.z);
    currentTranslation = [this.x, this.y, this.z];
    sphere(this.GetRadius(this.mass, this.denisty)); 
    translate(-this.x, -this.y, -this);
    currentTranslation = [0, 0, 0];
  }
  static clearBodies() { // Clears the array of bodies
    body.all = [];
  }
}

// Create two planets
let planet1 = new body(0, 0, 0, 100000, 1);
let planet2 = new body(200, 100, 0, 1000000, 2);

let currentTranslation = [0, 0, 0];


function setup() {
  createCanvas(800, 800, WEBGL);
}

function draw() {
  background(220);
  body.DrawPlanets();
  planet1.applyGravity();
  planet2.applyGravity();
  body.MovePlanets();
  console.log(planet1);
  console.log(planet2.vx);
  console.log(planet2.vy);
  console.log(planet2.vz);
}