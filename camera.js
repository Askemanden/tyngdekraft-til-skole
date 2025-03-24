const keyCodes = {
    "W" : 87,
    "A" : 65,
    "S" : 83,
    "D" : 68,
    "Q" : 81,
    "E" : 69,
    "Esc" : 27,
    "LeftArrow" : 37,
    "RightArrow" : 38,
    "DownArrow" : 40,
    "UpArrow" : 39
}
const camSensitivity = 0.003;

const camSpeed = 10;

let cam;

let camFocus = -1;

function setFocus(newFocus) {
    if(newFocus < body.all.length) {
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
    movement[1] +=int(keyIsDown(keyCodes["E"]));
    movement[1] -=int(keyIsDown(keyCodes["Q"]));

    
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
    if(camFocus !== -1 && camFocus < body.all.length) {
        cam.lookAt(body.all[camFocus].x, body.all[camFocus].y, body.all[camFocus].z);
    }
}