const keyCodes = {
    "W" : 87,
    "A" : 65,
    "S" : 83,
    "D" : 68,
    "Q" : 81,
    "E" : 69,
    "Esc" : 27,
    "LeftArrow" : 37,
    "RightArrow" : 39,
    "DownArrow" : 40,
    "UpArrow" : 38
}
const camSensitivity = 0.003;

const camSpeed = 10;

let cam;

let camFocus = -1;

let previousFocus = -1;

function setFocus(newFocus) {
    previousFocus = newFocus;
    if(newFocus < simulation.all.length) {
        camFocus = newFocus;
    }
}



function updateCamera() {

    let movement = [0,0,0];
    let rotation = [0,0];

    // forward backwards movement
    movement[2] -=int(keyIsDown(keyCodes["W"]));
    movement[2] +=int(keyIsDown(keyCodes["S"]));
    // left right movement
    movement[0] +=int(keyIsDown(keyCodes["D"]));
    movement[0] -=int(keyIsDown(keyCodes["A"]));
    // up down movement
    movement[1] +=int(keyIsDown(keyCodes["Q"]));
    movement[1] -=int(keyIsDown(keyCodes["E"]));

    
    // normalize movemnt
    let movementMagnitude = sqrt(movement[0]*movement[0] + movement[1]*movement[1] + movement[2]*movement[2]);
    if(movementMagnitude){
        for(let i = 0; i<3; i++){
            movement[i] = movement[i]/movementMagnitude;
        }
    }

    movement[0] *= camSpeed;
    movement[1] *= camSpeed;
    movement[2] *= camSpeed;

    if(mouseIsPressed){
        // rotation
        rotation[0] += (mouseX - pmouseX) * camSensitivity;
        rotation[1] -= (mouseY - pmouseY) * camSensitivity;
    }

    cam.move(movement[0], movement[1], movement[2]);

    cam.pan(rotation[0]);
    cam.tilt(rotation[1]);
}

function cameraFocus(){
    if(camFocus !== -1 && camFocus < simulation.all.length) { 
        // let distanceToTarget = dist(simulation.all[camFocus].x, simulation.all[camFocus].y, simulation.all[camFocus].z, cam.eyeX, cam.eyeY, cam.eyeZ);
        // if(distanceToTarget != simulation.all[camFocus].radius*5) {
        //     cam.move(0,0, simulation.all[camFocus].radius*5 - distanceToTarget);
        // }
        // grundet at cam.move forgår på non-lokal space, 
        // så er det ikke muligt at bruge cam.move til at flytte kameraet til en bestemt afstand fra planeten 
        // selvom det modsatte står i dokumentationen
        cam.lookAt(simulation.all[camFocus].x, simulation.all[camFocus].y, simulation.all[camFocus].z);
    }
}