class body { // body is a class that represents a body in space
  static all = []; // Array that contains all the bodies in space
  static G = 6.67430e-11; // Gravitational constant
  
  constructor(x, y, z, radius, density, vx=0, vy=0, vz=0) { // Constructor that creates the class properties
    this.x = x;
    this.y = y;
    this.z = z;
    this.density = density;
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
  //GetForce(other) { return(body.G*(this.mass*other.mass)/(this.GetDistance(other)**2)); } // Returns the gravitational force between two bodies
  GetKineticEnergy() { return(0.5*this.mass*(this.vx**2+this.vy**2+this.vz**2)); } // Returns the kinetic energy of the body
  GetVector(other) { // Returns the vector pointing from this body to another body
    let distance = this.GetDistance(other);
    return([(other.x-this.x) / distance, (other.y-this.y) / distance, (other.z-this.z) / distance]); 
  } 
  ApplyForce(forceVector) { // Applies a force to the body
  vx += forceVector[0]/this.mass;
  vy += forceVector[1]/this.mass;
  vz += forceVector[2]/this.mass;
  }

  static ApplyGravityAll() { // Applies gravity to all the bodies
    for(let p of body.all) {
      p.ApplyGravity();
    }
  }

  ApplyGravity() { // Applies gravity to a single body
    for (let i = 0; i < body.all.length; i++) {
      if (body.all[i] !== this) {
        let distance = this.GetDistance(body.all[i]); // Distance between the two bodies
        if (distance < this.radius) { distance = this.radius; } // Prevents division by zero, and excessive forces
        let force = body.G*(body.all[i].mass)/(distance)**2; // Gravitational force between bodies
        let difVector = this.GetVector(body.all[i]); // Vector pointing from this body to another body, with a length of 1
        this.vx += force * difVector[0] * deltaT;
        this.vy += force * difVector[1] * deltaT;
        this.vz += force * difVector[2] * deltaT;
      }
    }
  }

  CheckCollision(other) { // Checks if two bodies have collided
    let distance = this.GetDistance(other);
    if (distance < this.GetRadius(this.mass, this.density) + other.GetRadius(other.mass, other.density)) {
      return true;
    }
    return false;
  }

  ResolveCollision() { // Resolves a collision between two bodies
    //let thisKineticEnergy = this.GetKineticEnergy()
    //let otherKineticEnergy = other.GetKineticEnergy()
    //let thisVector = this.GetVector(other);
    //let otherVector = other.GetVector(this);
    for (body of body.all) {
      if (this.CheckCollision(body)) {
        this.Collide(body);
      }
    }
    let relativeSpeed = [other.vx - this.vx, other.vy - this.vy, other.vz - this.vz];
    this.vx = ((this.mass-other.mass)*relativeSpeed[0]/(this.mass+other.mass))
    other.vx = ((2*this.mass)*relativeSpeed[0]/(this.mass+other.mass))
    this.vy = ((this.mass-other.mass)*relativeSpeed[1]/(this.mass+other.mass))
    other.vy = ((2*this.mass)*relativeSpeed[1]/(this.mass+other.mass))
    this.vz = ((this.mass-other.mass)*relativeSpeed[2]/(this.mass+other.mass))
    other.vz = ((2*this.mass)*relativeSpeed[2]/(this.mass+other.mass))
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
    fill(200, 40, 0);
    translate(this.x, this.y, this.z);
    let currentTranslation = [this.x, this.y, this.z];
    sphere(this.GetRadius(this.mass, this.density)); 
    translate(-currentTranslation[0], -currentTranslation[1], -currentTranslation[2]);
    currentTranslation = [0, 0, 0];
  }
  static ClearBodies() { // Clears the array of bodies
    body.all = [];
  }
}

let deltaT = 500000; //variable for the time step. Higher numbers will make the simulation faster, but less accurate

