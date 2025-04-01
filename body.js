class body { // body is a class that represents a body in space

  constructor(name, x, y, z, mass, density, vx=0, vy=0, vz=0) { // Constructor that creates the class properties
    //this.ValidateParameters(); // Validates the parameters of the body
    this.name = name; // Name of the body
    this.x = x;
    this.y = y;
    this.z = z;
    this.density = density;
    this.radius = this.GetRadius(mass, density); // Returns the radius of the body
    this.mass = mass
    this.vx = vx;
    this.vy = vy;
    this.vz = vz;
    simulation.all.push(this);
  }
  
  ValidateParameters() { // Validates the parameters of the body
    if (this.name == undefined || this.name == null) { console.log("invalid name given"); return; } // Prevents invalid names
    if (this.x == undefined || this.x == null) { console.log("invalid x given"); return; } // Prevents invalid x values
    if (this.y == undefined || this.y == null) { console.log("invalid y given"); return; } // Prevents invalid y values
    if (this.z == undefined || this.z == null) { console.log("invalid z given"); return; } // Prevents invalid z values
    if (this.mass == undefined || this.mass == null || this.mass < 0) { console.log("invalid mass given"); return; } // Prevents invalid mass values
    if (this.density == undefined || this.density == null || this.density < 0) { console.log("invalid density given"); return; } // Prevents invalid density values
    if (this.vx == undefined || this.vx == null) { console.log("invalid vx given"); return; } // Prevents invalid vx values
    if (this.vy == undefined || this.vy == null) { console.log("invalid vy given"); return; } // Prevents invalid vy values
    if (this.vz == undefined || this.vz == null) { console.log("invalid vz given"); return; } // Prevents invalid vz values
    for (let i = 0; i < all.length; i++) {
      if (simulation.all[i].name == this.name) { // Prevents adding a body with the same name as another body
        console.log("body with this name already exists"); return;
      }
    }
  }

  GetRadius(mass, density) { return(Math.cbrt(mass/((3/4)*3.1416*density))); } // Returns the radius of the body
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
        eventManager.AddEvent(collision, GetIndex(this), simulation.all[i]); // Adds a collision event to the event manager
      } // Checks if the body has collided with another body

      }
    }
  }

  CheckCollision(other) { // Checks if two bodies have collided
    let distance = this.GetDistance(other);
    if (distance < this.radius + other.radius) {
      return true; // If the distance between the two bodies is less than the sum of their radii, they have collided
    }
    return false;
  }

  MovePlanet() {  // Moves the planet
    this.x += this.vx;
    this.y += this.vy;
    this.z += this.vz;
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

function ResolveCollision(planetA, planetB) { // Resolves a collision between two bodies. The collision is completely unelastic, and the bodies stick together, and reduce in size, as small fragments are ejected.
  let totalMass = planetA.mass + planetB.mass; // Total mass of the two bodies
  let finalVelocityVector = [ // the final velocity vector of the two bodies, after collision
    (planetA.mass * planetA.vx + planetB.mass * planetB.vx) / (totalMass),
    (planetA.mass * planetA.vy + planetB.mass * planetB.vy) / (totalMass),
    (planetA.mass * planetA.vz + planetB.mass * planetB.vz) / (totalMass)    
  ];

  let averageDensity = (planetA.density + planetB.density) / 2; // Average density of the two bodies
  let collisionEnergy = planetA.GetKineticEnergy() + planetB.GetKineticEnergy(); // Total kinetic energy of the two bodies
  let combinedGravity = planetA.GetGravitationalForce() + planetB.GetGravitationalForce();
  let planetVector = planetA.GetVector(planetB); // Vector pointing from planetA to planetB
  let planetDistance = planetA.GetDistance(planetB); // Distance between the two bodies

  let fragmentCount = Math.floor(collisionEnergy / combinedGravity);
  if (fragmentCount > 20) { fragmentCount = 20;  } // Maximum number of fragments 
  let FRAGMENTDENSITY = 1; // Density of the fragments. This is a constant, and can be ajusted after preference.
  let FRAGMENTRADIUS = planetA.GetRadius((totalMass * 0.2)/fragmentCount); // Radius of the fragments
  let finalPlanetMass = totalMass * 0.8; // Mass of the final planet
  let finalPlanetRadius = planetA.GetRadius(finalPlanetMass, averageDensity); // Radius of the final planet

  for (let i = 0; i < fragmentCount; i++) { // Creates the fragments
  let fragmentVector = GetRandomNormalVector(planetVector); // Generates a random normal vector, and finds the cross product between the original vector and the random vector
    new body(
      "fragment" + i,
      planetA.x + fragmentVector[0] * finalPlanetRadius,
      planetA.y + fragmentVector[1] * finalPlanetRadius,
      planetA.z + fragmentVector[2] * finalPlanetRadius,
      planetA.GetMass(FRAGMENTDENSITY, FRAGMENTRADIUS),
      FRAGMENTDENSITY,
      finalVelocityVector[0] + fragmentVector[0] * collisionEnergy / combinedGravity,
      finalVelocityVector[1] + fragmentVector[1] * collisionEnergy / combinedGravity,
      finalVelocityVector[2] + fragmentVector[2] * collisionEnergy / combinedGravity
    );
  }
  planetA.x = planetVector[0] * planetDistance / 2; // New x coordinate of the body
  planetA.y = planetVector[1] * planetDistance / 2; // New y coordinate of the body
  planetA.z = planetVector[2] * planetDistance / 2; // New z coordinate of the body
  planetA.density = averageDensity; // New density of the body
  planetA.radius = finalPlanetRadius; // New radius of the body
  planetA.mass = finalPlanetMass; // New mass of the body
  planetA.vx = finalVelocityVector[0];
  planetA.vy = finalVelocityVector[1];
  planetA.vz = finalVelocityVector[2];
}

//function SavePlanetsToJSON(fileName) {
  // Opret en array af planetdata
//  let planetData = simulation.all.map(planet => ({
//    name: planet.name,
//    x: planet.x,
//    y: planet.y,
//    z: planet.z,
//    mass: planet.mass,
//    density: planet.density,
//    vx: planet.vx,
//    vy: planet.vy,
//    vz: planet.vz
//  }));

  // convert to JSON
//  let json = JSON.stringify({ planets: planetData }, null, 2);

  // Opret en Blob og download filen
//  let blob = new Blob([json], { type: "application/json" });
//  let link = document.createElement("a");
//  link.href = URL.createObjectURL(blob);
//  link.download = fileName;
//  link.click();
//}

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
  constructor(type, planetA, planetB) {
    this.type = type
    this.bodyA = planetA
    this.bodyB = planetB
  }
}

class EventManager {
  constructor() { // Constructor that creates the class properties
    this.events = []; // Array that contains all the events
  }

  AddEvent(type, planetA, planetB) {  // Adds an event to the array
    new Event(type, planetA, planetB);  // Creates a new event
    this.events.push(new Event(type, planetA, planetB));  // Adds the event to the array
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

  RemoveEvent(index) { if (index > -1 || index <= this.events.length) { this.events.splice(index, 1); }else { console.log("Error! Tried to remove invalid index from collision array"); return }} // Removes an event from the array

  TriggerEvent(index) { // The event that is triggered. Index is the index of the event in the array
    if (index > this.events.length || index < 0) {  console.log("invalid index given, at function: TriggerEvent"); return; } // Prevents index out of bounds
    if (this.events[index] == undefined || this.events[index] == null ) { console.log("undefined event at index: " + index); return; } // Prevents undefined events
    switch (this.events[index].type) {
      case "collision":
        ResolveCollision(this.events[index].bodyA, this.events[index].bodyB); // Resolves the collision
        break;
//    case 

      default:
        console.log("invalid event type: " + this.events[index].type); // Prevents invalid event types
        break;
    }
    this.RemoveEvent(index); // Removes the event from the array
  }
}

class Simulation {
  constructor() { // Constructor that creates the class properties
    this.time = 0; // Time of the simulation
    this.deltaT = 100000; // Time step of the simulation. Higher numbers will make the simulation faster, but less accurate
    this.all = []; // Array that contains all the bodies in space
    this.G = 6.67430e-11; // Gravitational constant
  }

  Update() { // Updates the simulation
    this.time += this.deltaT; // Increases the time by the time step
    this.ApplyGravityAll(); // Applies gravity to all the bodies
    this.MovePlanets(); // Moves all the bodies
    eventManager.CheckForDuplicates(); // Checks for duplicates in the events array, and deletes them
    this.TriggerEvents(); // Triggers all the events in the array
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

  //LoadBodies(bodies) { // Loads bodies from an array
  //  for (let i = 0; i < bodies.length; i++) {
  //    new body(bodies[i].name, bodies[i].x, bodies[i].y, bodies[i].z, bodies[i].mass, bodies[i].density, bodies[i].vx, bodies[i].vy, bodies[i].vz); // Creates a new body with the given parameters
  //  }
  //}

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