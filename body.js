class body { // body is a class that represents a body in space
  static all = []; // Array that contains all the bodies in space
  static G = 6.67430e-11; // Gravitational constant
  static collisions = []; // Array that contains all the collisions in space
  
  constructor(x, y, z, mass, density, vx=0, vy=0, vz=0) { // Constructor that creates the class properties
    this.x = x;
    this.y = y;
    this.z = z;
    this.density = density;
    this.radius = this.GetRadius(mass, density); // Returns the radius of the body
    this.mass = mass
    this.vx = vx;
    this.vy = vy;
    this.vz = vz;
    body.all.push(this);
  }
  
  GetRadius(mass, density) { return(Math.cbrt(mass/((3/4)*3.1416*density))); } // Returns the radius of the body
  //GetMass(density, radius) { return(density*4/3*Math.PI*radius**3); } // Returns the mass of the body
  GetDistance(other) { return(Math.sqrt((other.x-this.x)**2+(other.y-this.y)**2+(other.z-this.z)**2)); } // Returns the distance between two bodies, using the Pythagorean theorem
  GetGravitationalForce()  { return(this.mass*body.G); } // Returns the force of the body
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
        if (distance < this.radius) { distance = this.radius; } // Prevents division by zero, and excessive gravitational forces when the bodies are very close to each other
        let force = body.G*(body.all[i].mass)/(distance)**2; // Gravitational force between bodies
        let difVector = this.GetVector(body.all[i]); // Vector pointing from this body to another body, with a length of 1
        this.vx += force * difVector[0] * deltaT;
        this.vy += force * difVector[1] * deltaT;
        this.vz += force * difVector[2] * deltaT;
      }
    }
  }

  GetRandomNormalVector(v) { // Generer en tilfældig vektor, og finde krydsproduktet mellem den oprindelige vektor og den tilfældige vektor
    let randomVector = [Math.random(), Math.random(), Math.random()];
    let normal = [  // Beregn krydsproduktet mellem den oprindelige vektor og den tilfældige vektor
      v[1] * randomVector[2] - v[2] * randomVector[1],
      v[2] * randomVector[0] - v[0] * randomVector[2],
      v[0] * randomVector[1] - v[1] * randomVector[0]
    ];
  
    // Normaliser normalvektoren, så den har længden 1
    let length = Math.sqrt(normalVector[0]**2 + normalVector[1]**2 + normalVector[2]**2);
    return [
      normalVector[0] / length,
      normalVector[1] / length,
      normalVector[2] / length
    ];

  }

  CheckCollision(other) { // Checks if two bodies have collided
    let distance = this.GetDistance(other);
    if (distance < this.radius + other.radius) {
      return true;
      
      
    }
    return false;
  }

  ResolveCollision(other) { // Resolves a collision between two bodies. The collision is completely unelastic, and the bodies stick together, and reduce in size, as small fragments are ejected.
    let totalMass = this.mass + other.mass; // Total mass of the two bodies
    let finalVelocityVector = [
      (this.mass * this.vx + other.mass * other.vx) / (totalMass),
      (this.mass * this.vy + other.mass * other.vy) / (totalMass),
      (this.mass * this.vz + other.mass * other.vz) / (totalMass)    
    ];

    let averageDensity = (this.density + other.density) / 2; // Average density of the two bodies
    let collisionEnergy = this.GetKineticEnergy() + other.GetKineticEnergy(); // Total kinetic energy of the two bodies
    let combinedGravity = this.GetGravitationalForce() + other.GetGravitationalForce();

    let FRAGMENTDENSITY = 1; // Density of the fragments
    let FRAGMENTRADIUS = Getradius((totalMass * 0.2)/fragmentCount); // Radius of the fragments
    let fragmentCount = Math.floor(collisionEnergy / combinedGravity);
    if (fragmentCount > 20) { fragmentCount = 20;  } // Maximum number of fragments 
    let finalPlanetMass = totalMass * 0.8; // Mass of the final planet
    let finalPlanetRadius = this.GetRadius(finalPlanetMass, averageDensity); // Radius of the final planet

    for (let i = 0; i < fragmentCount; i++) { // Creates the fragments
    let fragmentVector = this.GetRandomNormalVector(this.GetVector(other)); // Generates a random normal vector, and finds the cross product between the original vector and the random vector
      new body(
        this.x + fragmentVector[0] * finalPlanetRadius,
        this.y + fragmentVector[1] * finalPlanetRadius,
        this.z + fragmentVector[2] * finalPlanetRadius,
        this.GetMass(FRAGMENTDENSITY, FRAGMENTRADIUS),
        FRAGMENTDENSITY,
        finalVelocityVector[0] + fragmentVector[0],
        finalVelocityVector[1] + fragmentVector[1],
        finalVelocityVector[2] + fragmentVector[2]
      );
    }
    this.x = (this.x * this.mass + other.x * other.mass) / (this.mass + other.mass); // New x position of the body
    this.y = (this.y * this.mass + other.y * other.mass) / (this.mass + other.mass); // New y position of the body
    this.z = (this.z * this.mass + other.z * other.mass) / (this.mass + other.mass); // New z position of the body
    this.density = averageDensity; // New density of the body
    this.radius = finalPlanetRadius; // New radius of the body
    this.mass = finalPlanetMass; // New mass of the body
    this.vx = finalVelocityVector[0];
    this.vy = finalVelocityVector[1];
    this.vz = finalVelocityVector[2];
  }
  static CheckAndResolveCollisions() {
    for (let i = 0; i < body.all.length; i++) {
      for (let j = i + 1; j < body.all.length; j++) {
        let bodyA = body.all[i];
        let bodyB = body.all[j];
  
        // Tjek for kollision
        if (bodyA.CheckCollision(bodyB)) {
          bodyA.ResolveCollision(bodyB);
  
          // Fjern den anden planet fra simuleringen
          body.all.splice(j, 1); // Fjern bodyB fra arrayet
          j--; // Juster indekset for at undgå at springe over elementer
        }
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

