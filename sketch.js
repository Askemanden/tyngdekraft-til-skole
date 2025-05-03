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

const simulation = new Simulation(); // Creates a new simulation object
const eventManager = new EventManager(); // Creates a new event manager object


function setup() { 
    createCanvas(1200, 800, WEBGL); // Makes a background, and WebGL makes the background 3D
    deleteMenu = new UIMenu(
        [
            [createButton('delete').mouseClicked(()=>{
                if(selectedPlanet >= 0){
                    simulation.all.splice(selectedPlanet, 1);
                    selectedPlanet -= 1;
                }
            })],
            [createButton('next').mouseClicked(()=>{
                selectedPlanet +=1
                if(selectedPlanet >= simulation.all.length){
                    selectedPlanet = 0
                }
            })],
            [createButton('prev').mouseClicked(()=>{
                selectedPlanet -=1
                if(selectedPlanet < 0){
                    selectedPlanet = simulation.all.length - 1
                }
            })]
        ]
    )

    let inputX = createInput(0, 'number').size(75)
    
    let inputY = createInput(0, 'number').size(75)
    
    let inputZ = createInput(0, 'number').size(75)
    inputRadius = createInput(0, 'number').size(75)
    inputDensity = createInput(0,'number').size(75)

    let inputVX = createInput(0, 'number').size(75)
    let inputVY = createInput(0, 'number').size(75)
    let inputVZ = createInput(0, 'number').size(75)

    createMenu = new UIMenu( // makes a menu, where you can change a y, x, or z coordinate
        [
            [createP('coordinates in 1000 km from center')],
            [createP('x'), inputX, createP('y'), inputY, createP('z'), inputZ],
            [createP('radius in 1000 kilometers'), inputRadius],
            [createP('density in grams pr cubic centimeter'), inputDensity],
            [createP('velocity in 1000 km/s')],
            [createP('vx'), inputVX, createP('vy'), inputVY, createP('vz'), inputVZ],
            [createButton('Submit').size(165).mousePressed(() => {
                new body(
                    "planet" + simulation.all.length,
                    parseFloat(inputX.value()),
                    parseFloat(inputY.value()),
                    parseFloat(inputZ.value()),
                    parseFloat(inputRadius.value()),
                    parseFloat(inputDensity.value())*10e12,
                    parseFloat(inputVX.value()),
                    parseFloat(inputVY.value()),
                    parseFloat(inputVZ.value())
                );
            })]
        ]
    )

    let realInputX = createInput(0, 'number').size(75)
    let realInputY = createInput(0, 'number').size(75)
    let realInputZ = createInput(0, 'number').size(75)
    let realInputVX = createInput(0, 'number').size(75)
    let realInputVY = createInput(0, 'number').size(75)
    let realInputVZ = createInput(0, 'number').size(75)
    let planetName = createInput().size(75)

    createRealPlanetMenu = new UIMenu(
        [
            [createP('coordinates in 1000 km from center')],
            [createP('x'), realInputX, createP('y'), realInputY, createP('z'), realInputZ],
            [createP('planet name'), planetName],
            [createP('velocity in 1000 km/s')],
            [createP('vx'), realInputVX, createP('vy'), realInputVY, createP('vz'), realInputVZ],
            [createButton('Submit').size(165).mousePressed(() => {
                fetchData(
                    planetName.value(),
                    parseFloat(realInputX.value()),
                    parseFloat(realInputY.value()),
                    parseFloat(realInputZ.value()),
                    parseFloat(realInputVX.value()),
                    parseFloat(realInputVY.value()),
                    parseFloat(realInputVZ.value())
                );
            })]
        ]
    )
    cam = createCamera();
    cam.perspective(undefined, undefined, 30, 150000);

    let audio = createAudio("Lyd.mp3", () => {audio.play(); audio.loop();});

    let audioMenu = new UIMenu(
        [
            [createButton('Turn on audio').mousePressed(()=>{
                audio.play();
                audio.loop();
            }), 
            createButton('Pause audio').mousePressed(()=>{
                audio.pause();
            }), 
            createButton('Stop the audio').mousePressed(()=>{
                audio.stop();
            })]
        ]
    );

    menus = {
        "start": new UIMenu([[]]),
        "delete": deleteMenu,
        "create": createMenu,
        "createRealPlanet": createRealPlanetMenu,
        "audio": audioMenu
    }
    menuManager = new UIMenuManager(menus, [10,20], undefined, "rgb(141, 160, 211)", "rgb(97, 98, 99)", "rgb(148, 149, 149)");
    //menuManager = new UIMenuManager([new UIMenu([[]]),deleteMenu, createMenu, createRealPlanetMenu, audioMenu], [10,20], undefined, "rgb(141, 160, 211)", "rgb(97, 98, 99)", "rgb(148, 149, 149)");
}

function keyReleased() {
    if (keyCode === keyCodes["UpArrow"] || keyCode === keyCodes["Esc"]) {
        selectedPlanet = -1;
    } else if (keyCode === keyCodes["LeftArrow"]) {
        selectedPlanet -= 1;
        if (selectedPlanet < 0) {
            selectedPlanet = simulation.all.length - 1;
        }
    } else if (keyCode === keyCodes["RightArrow"]) {
        selectedPlanet += 1;
        if (selectedPlanet >= simulation.all.length) {
            selectedPlanet = 0;
        }
    }
}


function draw() {
    background(220, 220, 220);
    if(menuManager.selected!==menuManager.menus["start"]){
        simulating=false;
    } else{
        simulating=true;
    }
    if(simulating) {
        // Updates the camera position and focus
        updateCamera();

        // Update the simulation
        simulation.Update();
    }
    setFocus(selectedPlanet);
    cameraFocus();
    simulation.DrawPlanets();
    
    
    
  }