class body{ // body is a class that represents a body in space
  static all = []; // Array that contains all the bodies in space
  static G = 6.67430e-11; // Gravitational constant
  
  constructor(x, y, z, radius, density, vx=0, vy=0, vz=0) { // Constructor that creates the class properties
    this.x = x;
    this.y = y;
    this.z = z;
    this.denisty = density;
    this.radius = radius;
    this.mass = this.GetMass(density, radius);
    this.vx = vx;
    this.vy = vy;
    this.vz = vz;
    body.all.push(this);
  }
  
  GetRadius(mass, density) { return(Math.cbrt(mass/((3/4)*3.1416*density))); } // Returns the radius of the body
  GetMass(density, radius) { return(density*4/3*Math.PI*radius**3); } // Returns the mass of the body
  GetDistance(other) { return(Math.sqrt((other.x-this.x)**2+(other.y-this.y)**2+(other.z-this.z)**2)); } // Returns the distance between two bodies
  GetForce(other) { return(body.G*this.mass*other.mass/(this.GetDistance(other)**2)); } // Returns the gravitational force between two bodies
  
  static ApplyGravityAll(){
    for(let p of body.all) {
      p.ApplyGravity();
    }
  }

  ApplyGravity() { // Applies gravity to the body
    for (let i = 0; i < body.all.length; i++) {
      if (body.all[i] !== this) {
        let distance = this.GetDistance(body.all[i]); // Distance between the two bodies
        if (distance < this.radius) { distance = this.radius; } // Prevents division by zero, and excessive forces
        let force = GetForce(body.all[i]);  // Gravitational force between bodies
        let difVector = [(body.all[i].x-this.x)/distance, (body.all[i].y-this.y)/distance, (body.all[i].z-this.z)/distance]; // Vector pointing from this body to another body, with a length of 1
        this.vx += force * difVector[0] / this.mass * deltaT;
        this.vy += force * difVector[1] / this.mass * deltaT;
        this.vz += force * difVector[2] / this.mass * deltaT;
      }
    }
  }

  CheckCollision(other) { // Checks if two bodies have collided
    let distance = this.GetDistance(other);
    if (distance < this.GetRadius(this.mass, this.denisty) + other.GetRadius(other.mass, other.denisty)) {
      return true;
    }
    return false;
  }
  
  resolveCollision(other) { // Resolves a collision between two bodies
  
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
    let currentTranslation = [this.x, this.y, this.z];
    sphere(this.GetRadius(this.mass, this.denisty)); 
    translate(-this.x, -this.y, -this.z);
    currentTranslation = [0, 0, 0];
  }
  static clearBodies() { // Clears the array of bodies
    body.all = [];
  }
}

let deltaT = 5000000; //variable for the time step. Higher numbers will make the simulation faster, but less accurate

