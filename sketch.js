let simulating = false;

let selectedPlanet = -1;

let startMenu;

let deleteMenu;

let createMenu; 

let menuManager;

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
    startMenu = new UIMenu( [
            [createButton('start').mouseClicked(()=>{simulating=true; startMenu.hide()})]
        ]
    )
    startMenu.container.size(windowWidth, windowHeight)

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
            [createP('x'), createInput(0, 'number').size(75), createP('y'), createInput(0, 'number').size(75), createP('z'), createInput(0, 'number').size(75)],
            [createP('radius'), createInput(50, 'number').size(75)]
        ]
    )

    cam = createCamera();


    menuManager = new UIMenuManager([new UIMenu([[]]),deleteMenu, createMenu], [10,20], undefined, "rgb(141, 160, 211)", "rgb(97, 98, 99)", "rgb(148, 149, 149)");
}

// Create two planets, with coordinates for each planet
let planet1 = new body(-200, -100, 0, 10, 100, 0, 0, 1.3);
let planet2 = new body(0, 0, 0, 40, 20, 0, 0, 0);

function draw() {
    background(220, 220, 220);
    if(simulating) {
        body.DrawPlanets();
        body.ApplyGravityAll();
        body.MovePlanets();
        updateCamera();
    }
    setFocus(selectedPlanet);
    cameraFocus();
  }