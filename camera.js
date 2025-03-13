//VARIABLER
//Her beskrives, hvordan cameravinklerne starter med at se ud, og hvor høj sensitivity der er på zoom
let camX = 0, camY = 0, camZ = 400;  // Kameraets position
let angleX = 0, angleY = 0;          // Kameravinkel
let zoomSpeed = 20;                  // Zoom-hastighed
isDragging = false;
let lastMouseX, lastMouseY;
//Andre variabler som array til tilfældige planeter og zoom slideren
let planets = [];  // Array til planeter
let zoomSlider;    // Zoom-slider

//////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//Baggrunden laves
function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    // Der oprettes nogle tilfældige planeter og der køres et for-loop der viser, hvor mange planeter vi får (5). For-loopet tilføjer objekter til planet arrayet, og planet.push tilføjer hvert et af dem til planet arrayet.
    for (let i = 0; i < 5; i++) {
        planets.push({
            x: random(-250, 250),
            y: random(-250, 250),
            z: random(-250, 250),
            size: random(20, 60)
        });
    }
//////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    // Der oprettes en slider til at justere zoom
    zoomSlider = createSlider(50, 1000, camZ, 1);
    zoomSlider.position(20, windowHeight - 40);
    zoomSlider.style('width', '200px');
}
/////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function draw() {
    background(0);
    lights();

    // Opdater zoom fra slideren
    camZ = zoomSlider.value();

    // Anvend kamera-transformationer
    applyCamera();

    // Tegn planeterne, og der beskrives også, planeternes udseende
    for (let planet of planets) {
        push();
        translate(planet.x, planet.y, planet.z);
        fill(100, 200, 400);
        noStroke();
        sphere(planet.size);
        pop();
    }

    //  Tegn zoom-tekst ved slideren
    drawUI();
}

//  Funktion til at opdatere kameraets position
function applyCamera() {
    translate(0, 0, -camZ);  // Zoom-effekt
    rotateX(angleX);
    rotateY(angleY);
}

//  Funktion til UI-elementer (f.eks. zoom-tekst)
function drawUI() {
    push();
    resetMatrix();  // Sørger for at tegne UI uafhængigt af 3D-kameraet
    fill(255);
    pop();
}

//  Registrér musens bevægelse for at rotere kameraet
function mouseDragged() {
    if (mouseButton === LEFT) {
        let dx = mouseX - lastMouseX;
        let dy = mouseY - lastMouseY;
        angleY -= dx * 0.01;
        angleX += dy * 0.01;
    } else if (mouseButton === RIGHT || keyIsDown(SHIFT)) {
        // Flyt kameraet sideværts (pan)
        let dx = mouseX - lastMouseX;
        let dy = mouseY - lastMouseY;
        camX -= dx * 2;
        camY += dy * 2;
    }
    lastMouseX = mouseX;
    lastMouseY = mouseY;
}

//  Gem musens position ved tryk
function mousePressed() {
    lastMouseX = mouseX;
    lastMouseY = mouseY;
}

//  Zoom også med scrollhjulet, så man ikke kun behøver at bruge baren
function mouseWheel(event) {
    camZ += event.delta * zoomSpeed * 0.1;
    camZ = constrain(camZ, 50, 1000);
    zoomSlider.value(camZ);  // Opdater slideren
}

//  Gør canvas responsivt, altså så det reagere på det brugeren gør
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    zoomSlider.position(20, windowHeight - 40);
}