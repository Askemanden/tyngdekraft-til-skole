
/**
 * @class Body
 * 
 * This class represents a body in space, with properties such as position, mass, density, and velocity.
 * @property {string} name - The name of the body.
 * @property {number} x - The x-coordinate of the body. (megameters)
 * @property {number} y - The y-coordinate of the body. (megameters)
 * @property {number} z - The z-coordinate of the body. (megameters)
 * @property {number} mass - The mass of the body. (kilotons)
 * @property {number} density - The density of the body. (kg/Mm^3 (kilotons per megameter cubed))
 * @property {number} radius - The radius of the body, calculated from mass and density
 * @property {number} vx - The x-component of the body's velocity. (megameters)
 * @property {number} vy - The y-component of the body's velocity. (megameters)
 * @property {number} vz - The z-component of the body's velocity. (megameters)
 * 
 */
class body { // body is a class that represents a body in space

  constructor(name, x, y, z, radius, density, vx=0, vy=0, vz=0) { // Constructor that creates the class properties
    this.name = name; // Name of the body
    this.x = x;
    this.y = y;
    this.z = z;
    this.density = density;
    this.radius = radius; // Returns the radius of the body
    this.mass = this.GetMass(this.density, this.radius); // Returns the mass of the body
    this.vx = vx;
    this.vy = vy;
    this.vz = vz;
    this.ValidateParameters(); // Validates the parameters of the body
  }
  
  ValidateParameters() { // Validates the parameters of the body
    if (this.name == undefined || this.name == null) { console.log("invalid name given"); return; } // Prevents invalid names
    if (this.x == undefined || this.x == null) { console.log("invalid x given"); return; } // Prevents invalid x values
    if (this.y == undefined || this.y == null) { console.log("invalid y given"); return; } // Prevents invalid y values
    if (this.z == undefined || this.z == null) { console.log("invalid z given"); return; } // Prevents invalid z values
    if (this.mass == undefined || this.mass == null || this.mass < 0) { console.log("invalid mass given"); return; } // Prevents invalid mass values
    if (this.density == undefined || this.density == null || this.density < 0) { console.log("invalid density given" + this.density); return; } // Prevents invalid density values
    if (this.vx == undefined || this.vx == null) { console.log("invalid vx given"); return; } // Prevents invalid vx values
    if (this.vy == undefined || this.vy == null) { console.log("invalid vy given"); return; } // Prevents invalid vy values
    if (this.vz == undefined || this.vz == null) { console.log("invalid vz given"); return; } // Prevents invalid vz values
    for (let i = 0; i < simulation.all.length; i++) {
      if (simulation.all[i].name == this.name) { // Prevents adding a body with the same name as another body
        console.log("body with this name already exists"); return;
      }
    }
    simulation.all.push(this);
  }

  GetRadius(mass, density = 1) { return(Math.cbrt(mass/((3/4)*3.1416*density))); } // Returns the radius of the body
  GetMass(density, radius) { return(density*4/3*Math.PI*radius**3); } // Returns the mass of the body
  GetDistance(other) { return(Math.sqrt((other.x-this.x)**2+(other.y-this.y)**2+(other.z-this.z)**2)); } // Returns the distance between two bodies, using the Pythagorean theorem
  GetGravitationalForce() { return(this.mass*simulation.G); } // Returns the force of the body
  GetKineticEnergy() { return(0.5*this.mass*(this.vx**2+this.vy**2+this.vz**2)); } // Returns the kinetic energy of the body
  GetVector(other) { // Returns the vector pointing from this body to another body
    let distance = this.GetDistance(other);
    if (distance == 0) { return([0, 0, 0]); } // Prevents division by zero
    return([(other.x-this.x) / distance, (other.y-this.y) / distance, (other.z-this.z) / distance]); 
  }

  ApplyForce(forceVector) { // Applies a force to the body
  this.vx += forceVector[0] / this.mass * simulation.deltaT;
  this.vy += forceVector[1] / this.mass * simulation.deltaT;
  this.vz += forceVector[2] / this.mass * simulation.deltaT;
  }

  ApplyGravity() { // Applies gravity to a single body
    for (let i = 0; i < simulation.all.length; i++) {
      if (simulation.all[i] !== this) {
        let distance = this.GetDistance(simulation.all[i]); // Distance between the two bodies
        if (distance < this.radius) { distance = this.radius; } // Prevents division by zero, and excessive gravitational forces when the bodies are very close to each other
        let force = simulation.G*(simulation.all[i].mass * this.mass)/(distance)**2; // Gravitational force between bodies
        let difVector = this.GetVector(simulation.all[i]); // Vector pointing from this body to another body, with a length of 1
        this.ApplyForce([force * difVector[0], force * difVector[1], force * difVector[2]]); // Applies the force to the body
      }
    }
  }

  GetIndex(body) { // Returns the index of this body in the array
    for (let i = 0; i < simulation.all.length; i++) {
      if (simulation.all[i] === body) {
        return i; // Returns the index of the body in the array
      }
    }
  }

  ApplyCollision() {
    for (let i = 0; i < simulation.all.length; i++) {
      if (simulation.all[i] !== this) {
      if (this.CheckCollision(simulation.all[i])) {
        eventManager.AddEvent("collision", this.GetIndex(this), i); // Adds a collision event to the event manager
      } // Checks if the body has collided with another body
      }
    }
  }

  CheckCollision(other) { // Checks if two bodies have collided
    if (other == this) { return false; } // Prevents checking for collision with itself
   let distance = this.GetDistance(other);
    if (distance < this.radius + other.radius) { // If the distance between the two bodies is less than the sum of their radii, they have collided
      this.immunityTime = 1; // Sets the immunity time to 1, so the body is immune to collisions for 1 second
      other.immunityTime = 1; // Sets the immunity time to 1, so the body is immune to collisions for 1 second
      return true; // If the distance between the two bodies is less than the sum of their radii, they have collided 
    }
    return false;
  }

  MovePlanet() {  // Moves the planet
    this.x += this.vx;
    this.y += this.vy;
    this.z += this.vz;
    if (this.immunityTime != 0) {this.immunityTime -= simulation.deltaT; } // Decreases the immunity time by the time step
    if (this.immunityTime < 0) { this.immunityTime = 0; } // Prevents negative immunity time
  }

  DrawBody() { // Draws the body
    fill(200, 40, 0);
    translate(this.x, this.y, this.z);
    let currentTranslation = [this.x, this.y, this.z];
    sphere(this.GetRadius(this.mass, this.density)); 
    translate(-currentTranslation[0], -currentTranslation[1], -currentTranslation[2]);
    currentTranslation = [0, 0, 0];
  }
}

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\ 

function GetRandomNormalVector(v) { // Generer en tilfældig vektor, og finde krydsproduktet mellem den oprindelige vektor og den tilfældige vektor
  let randomVector = [Math.random(), Math.random(), Math.random()];
  let normal = [  // Beregn krydsproduktet mellem den oprindelige vektor og den tilfældige vektor
    v[1] * randomVector[2] - v[2] * randomVector[1],
    v[2] * randomVector[0] - v[0] * randomVector[2],
    v[0] * randomVector[1] - v[1] * randomVector[0]
  ];

  // Normaliser normalvektoren, så den har længden 1
  let length = Math.sqrt(normal[0]**2 + normal[1]**2 + normal[2]**2);
  return [
    normal[0] / length,
    normal[1] / length,
    normal[2] / length
  ];

}

//function ResolveCollision(indexOfA, indexOfB) { // Resolves a collision between two bodies. The collision is completely unelastic, and the bodies stick together, and reduce in size, as small fragments are ejected.

//  simulation.all[indexOfA].x = planetVector[0] * planetDistance / 2; // New x coordinate of the body
//  simulation.all[indexOfA].y = planetVector[1] * planetDistance / 2; // New y coordinate of the body
//  simulation.all[indexOfA].z = planetVector[2] * planetDistance / 2; // New z coordinate of the body
//  simulation.all[indexOfA].density = averageDensity; // New density of the body
//  simulation.all[indexOfA].radius = finalPlanetRadius; // New radius of the body
//  simulation.all[indexOfA].mass = finalPlanetMass; // New mass of the body
//  simulation.all[indexOfA].vx = finalVelocityVector[0];
//  simulation.all[indexOfA].vy = finalVelocityVector[1];
//  simulation.all[indexOfA].vz = finalVelocityVector[2];

//  simulation.all.splice(indexOfB, 1); // Removes the second body from the array, as it is now part of the first body
//}

function SavePlanetsToJSON(fileName) {
  // Opret en array af planetdata
  let planetData = simulation.all.map(planet => ({
    name: planet.name,
    x: planet.x,
    y: planet.y,
    z: planet.z,
    mass: planet.mass,
    density: planet.density,
    vx: planet.vx,
    vy: planet.vy,
    vz: planet.vz
  }));

  // convert to JSON
  let json = JSON.stringify({ planets: planetData }, null, 2);

  // Opret en Blob og download filen
  let blob = new Blob([json], { type: "application/json" });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}

function LoadPlanetsFromJSON(filePath) {
  fetch(filePath)
    .then(response => response.json()) // Parse JSON-filen
    .then(data => {
      simulation.LoadBodies(data.planets); // Load planets from the parsed data
      console.log("Planets loaded successfully:", data.planets); // Log the loaded planets
    })
    .catch(error => console.error("Error loading JSON file:", error));
}

function LoadPlanetsFromFile() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    console.error("No file selected");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    const data = JSON.parse(event.target.result);
    simulation.LoadBodies(data.planets); // Brug data til at oprette planeter
    console.log("Planets loaded:", data.planets);
  };
  reader.readAsText(file);
}

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

class Event { // A class to represent an event.
  constructor(type, indexOfA, indexOfB) {
    this.type = type
    this.bodyA = indexOfA;
    this.bodyB = indexOfB;
  }
}

class EventManager {
  constructor() { // Constructor that creates the class properties
    this.events = []; // Array that contains all the events
  }

  AddEvent(type, indexOfA, indexOfB) {  // Adds an event to the array
    new Event(type, indexOfA, indexOfB);  // Creates a new event
    this.events.push(new Event(type, indexOfA, indexOfB));  // Adds the event to the array
  }

  CheckForDuplicates() { // Checks for duplicates in the events array
    for (let i = 0; i < this.events.length; i++) {
      for (let j = i + 1; j < this.events.length; j++) {

        if (this.events[i].type == this.events[j].type) {
        if (this.events[i].bodyA == this.events[j].bodyA && this.events[i].bodyB == this.events[j].bodyB && this.events[i].type == this.events[j].type) { // Checks if the two events are the same
          this.RemoveEvent(j); // Removes the duplicate event from the array
        }
        else if (this.events[i].bodyA == this.events[j].bodyB && this.events[i].bodyB == this.events[j].bodyA && this.events[i].type == this.events[j].type) { // Checks if the two events are the same, but in reverse order
          this.RemoveEvent(j); // Removes the duplicate event from the array
          }
        }
      }
    }
  }

  RemoveEvent(index) { 
    if (index > -1 || index <= this.events.length) {
      this.events.splice(index, 1); 
    }else { 
      console.log("Error! Tried to remove invalid index from collision array"); return 
    }
  }

  TriggerEvent(index) { // Index is the index of the event in the array

    if (index > this.events.length || index < 0) {
      console.log("invalid index given, at function: TriggerEvent"); 
      return; 
    } // Prevents index out of bounds

    if (this.events[index] == undefined || this.events[index] == null ) { 
      console.log("undefined event at index: " + index); 
      return; 
      } // Prevents undefined events

    switch (this.events[index].type) {
      case "collision": // If the event is a collision
        this.ResolveCollision(eventManager.events[index].bodyA, eventManager.events[index].bodyB); // Resolves the collision
        
        break;
      default:
        console.log("invalid event type: " + this.events[index].type); // Prevents invalid event types
        break;
    }
    this.RemoveEvent(index); // Removes the event from the array
  }

  /**
   * Resolves a collision between two bodies. 
   * Collision is completely inelastic, causing bodies to stick together after collision simulating merging of bodies
   * @param {Body} bodyA 
   * @param {Body} bodyB 
   * @returns {void}
   */
  ResolveCollision(bodyA, bodyB) {

    bodyA = simulation.all[bodyA]; // Get the body object from the array
    bodyB = simulation.all[bodyB]; // Get the body object from the array

    // Calculate combined mass
    const combinedMass = bodyA.mass + bodyB.mass;

    // Calculate momentum components for both bodies
    const momentumA = {
        x: bodyA.vx * bodyA.mass,
        y: bodyA.vy * bodyA.mass,
        z: bodyA.vz * bodyA.mass
    };

    const momentumB = {
        x: bodyB.vx * bodyB.mass,
        y: bodyB.vy * bodyB.mass,
        z: bodyB.vz * bodyB.mass
    };

    // Calculate total momentum in each direction
    const totalMomentum = {
        x: momentumA.x + momentumB.x,
        y: momentumA.y + momentumB.y,
        z: momentumA.z + momentumB.z
    };

    // Calculate final velocity in each direction (common velocity after collision)
    const finalVelocity = {
        x: totalMomentum.x / combinedMass,
        y: totalMomentum.y / combinedMass,
        z: totalMomentum.z / combinedMass
    };

    // Update both bodies to have the same velocity after the collision
    bodyA.vx = finalVelocity.x;
    bodyA.vy = finalVelocity.y;
    bodyA.vz = finalVelocity.z;

    bodyB.vx = finalVelocity.x;
    bodyB.vy = finalVelocity.y;
    bodyB.vz = finalVelocity.z;


    return finalVelocity; // Return the common velocity vector for debugging or logging
  }

}

class Simulation {
  constructor() { // Constructor that creates the class properties
    this.time = 0; // Time of the simulation
    this.deltaT = 1500000; // Time step of the simulation. Higher numbers will make the simulation faster, but less accurate
    this.all = []; // Array that contains all the bodies in space
    this.G = 6.67430e-26; // Gravitational constant in mega meters (1000 km) and kilotons.
    //this.G = 6.67430e-11; // Gravitational constant in mega meters (1000 km) and kilotons.
    this.SCALE = 1; // Scale of the simulation. -Higher  numbers means smaller bodies, and lower numbers means bigger bodies. 1 is the default value, but the calculations remain the same.
  }

  Update() { // Updates the simulation
    this.time += this.deltaT; // Increases the time by the time step
    //console.log(simulation.all);
    this.ApplyGravityAll(); // Applies gravity to all the bodies
    this.ApplyCollisionAll(); // Applies collision to all the bodies
    eventManager.CheckForDuplicates(); // Checks for duplicates in the events array, and deletes them
    this.TriggerEvents(); // Triggers all the events in the array
    this.MovePlanets(); // Moves all the bodies
  }

  DrawPlanets() {  // Draws all the planets
    for(let p of simulation.all) {
      p.DrawBody();
    }
  }
  
  MovePlanets() {  // Moves all the planets
    for(let p of simulation.all) {
      p.MovePlanet();
    }
  }
  
  ApplyGravityAll() { // Applies gravity to all the bodies
    for(let p of simulation.all) {
      p.ApplyGravity();
    }
  }

  TriggerEvents() { // Triggers all the events in the array
    for (let i = 0; i < eventManager.events.length; i++) {
      eventManager.TriggerEvent(i);
    }
  }

  ApplyCollisionAll() { // Applies collision to all the bodies
    for(let p of simulation.all) {
      p.ApplyCollision();
    }
  }

  LoadBodies(bodies) { // Loads bodies from an array
    for (let i = 0; i < bodies.length; i++) {
      new body(bodies[i].name, bodies[i].x, bodies[i].y, bodies[i].z, bodies[i].mass, bodies[i].density, bodies[i].vx, bodies[i].vy, bodies[i].vz); // Creates a new body with the given parameters
    }
  }

  ClearBodies() { // Clears the array of bodies
    this.all = [];
  }

  Pause() { // Stops the simulation
  simulating = false;
  }

  Start() { // Starts the simulation
  simulating = true;
  }

  Restart() { // Restarts the simulation
    this.ClearBodies();
    this.time = 0;
    this.deltaT = 100000;
    this.Start();
  }
}