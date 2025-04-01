let simulating = true;

let selectedPlanet = -1;

let deleteMenu;

let createMenu; 

let createRealPlanetMenu;

let menuManager;

let leftUp = true;

let rightUp = true;

let inputRadius;

let inputDensity;


function updateSelected(){
    if(keyIsDown(keyCodes["Esc"])){
        selectedPlanet = -1;
    } else if(keyIsDown(keyCodes["LeftArrow"])){
        selectedPlanet -=1
        if(selectedPlanet < 0){
            selectedPlanet = body.all.length - 1
        }
    } else if(keyIsDown(keyCodes["RightArrow"])){
        selectedPlanet +=1
        if(selectedPlanet >= body.all.length){
            selectedPlanet = 0
        }
    }
}

function setup() { 
    createCanvas(800, 800, WEBGL); // Makes a background, and WebGL makes the background 3D
    deleteMenu = new UIMenu(
        [
            [createButton('delete').mouseClicked(()=>{
                if(selectedPlanet >= 0){
                    body.all.splice(selectedPlanet, 1);
                    selectedPlanet -= 1;
                }
            })],
            [createButton('next').mouseClicked(()=>{
                selectedPlanet +=1
                if(selectedPlanet >= body.all.length){
                    selectedPlanet = 0
                }
            })],
            [createButton('prev').mouseClicked(()=>{
                selectedPlanet -=1
                if(selectedPlanet < 0){
                    selectedPlanet = body.all.length - 1
                }
            })]
        ]
    )

    let inputX = createInput(0, 'number').size(75)
    
    let inputY = createInput(0, 'number').size(75)
    
    let inputZ = createInput(0, 'number').size(75)
    inputRadius = createInput(0, 'number').size(75)
    inputDensity = createInput(0,'number').size(75)

    createMenu = new UIMenu( // makes a menu, where you can change a y, x, or z coordinate
        [
            [createP('coordinates in km from center')],
            [createP('x'), inputX, createP('y'), inputY, createP('z'), inputZ],
            [createP('radius in meters'), inputRadius],
            [createP('density in kilos per cubic meter'), inputDensity],
            [createButton('Submit').size(165).mousePressed(() => {
                new body(
                    parseFloat(inputX.value()),
                    parseFloat(inputY.value()),
                    parseFloat(inputZ.value()),
                    parseFloat(inputRadius.value()),
                    parseFloat(inputDensity.value()),
                    0, 0, 0
                );
            })]
        ]
    )

    let realInputX = createInput(0, 'number').size(75)
    let realInputY = createInput(0, 'number').size(75)
    let realInputZ = createInput(0, 'number').size(75)
    let planetName = createInput().size(75)

    createRealPlanetMenu = new UIMenu(
        [
            [createP('coordinates in km from center')],
            [createP('x'), realInputX, createP('y'), realInputY, createP('z'), realInputZ],
            [createP('planet name'), planetName],
            [createButton('Submit').size(165).mousePressed(() => {
                fetchData(
                    planetName.value(),
                    parseFloat(realInputX.value()),
                    parseFloat(realInputY.value()),
                    parseFloat(realInputZ.value())
                );
            })]
        ]
    )
    cam = createCamera();


    menuManager = new UIMenuManager([new UIMenu([[]]),deleteMenu, createMenu, createRealPlanetMenu], [10,20], undefined, "rgb(141, 160, 211)", "rgb(97, 98, 99)", "rgb(148, 149, 149)");
}

let planet1 = new body(0, 0, 0, 200, 20, 0, 0, 0);
let planet2 = new body(500, 300, 0, 10, 1, 0, 0, 7);
//let planet3 = new body(700, 700, 700, 200, 20, 0, 0, 0);

function keyReleased() {
    if (keyCode === keyCodes["UpArrow"]) {
        selectedPlanet = -1;
    } else if (keyCode === keyCodes["LeftArrow"]) {
        selectedPlanet -= 1;
        if (selectedPlanet < 0) {
            selectedPlanet = body.all.length - 1;
        }
    } else if (keyCode === keyCodes["RightArrow"]) {
        selectedPlanet += 1;
        if (selectedPlanet >= body.all.length) {
            selectedPlanet = 0;
        }
    }
}


function draw() {
    background(220, 220, 220);
    if(menuManager.selected!==menuManager.menus[0]){
        simulating=false;
    } else{
        simulating=true;
    }
    body.DrawPlanets();
    if(simulating) {
        // Applies the gravity to all bodies
        body.ApplyGravityAll();

        // Checks and calculates the collisions between all bodies
        body.CheckAndResolveCollisions();

        // Moves the bodies according to their velocity and acceleration
        body.MovePlanets();
        
        // Updates the camera position and focus
        updateCamera();
    }
    setFocus(selectedPlanet);
    cameraFocus();
  }