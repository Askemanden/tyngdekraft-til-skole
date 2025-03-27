let simulating = true;

let selectedPlanet = -1;

let deleteMenu;

let createMenu; 

let menuManager;

let leftUp = true;

let rightUp = true;

let inputRadius;

let inputDensity;

let inputX;

let inputY;

let inputZ;
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

    createMenu = new UIMenu( // makes a menu, where you can change a y, x, or z coordinate
        [
            [createP('coordinates')],
            [createP('x'), inputX = createInput(0, 'number').size(75), createP('y'), inputY = createInput(0, 'number').size(75), createP('z'), inputZ = createInput(0, 'number').size(75)],
            [createP('radius'), inputRadius = createInput(0, 'number').size(75)],
            [createP('density'), inputDensity = createInput(0,'number').size(75)],
            [createButton('Submit').size(165).mousePressed(() => {
                let newData = {
                    x: inputX.value(),
                    y: inputY.value(),
                    z: inputZ.value(),
                    radius: inputRadius.value(),
                    density: inputDensity.value(),
                }

            })]
        ]
    )
    cam = createCamera();


    menuManager = new UIMenuManager([new UIMenu([[]]),deleteMenu, createMenu], [10,20], undefined, "rgb(141, 160, 211)", "rgb(97, 98, 99)", "rgb(148, 149, 149)");
}

let planet1 = new body(0, 0, 0, 200, 20, 0, 0, 0);
let planet2 = new body(500, 300, 0, 10, 1, 0, 0, 7);
let planet3 = new body(700, 700, 700, 200, 20, 0, 0, 0);

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
    if(simulating) {
        body.DrawPlanets();
        body.ApplyGravityAll();
        ResolveCollisions();

        body.MovePlanets();
        updateCamera();
    }
    setFocus(selectedPlanet);
    cameraFocus();
  }