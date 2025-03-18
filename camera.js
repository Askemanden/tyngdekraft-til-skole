const keyCodes = {
    "W" : 87,
    "A" : 65,
    "S" : 83,
    "D" : 68,
    "Q" : 81,
    "E" : 69,
    "SPACE" : 32,
    "L" : 76
}

const camSensitivity = 1;

const camSpeed = 1;

let cam = createCamera();

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
    movement[2] +=int(keyIsDown(keyCode["W"]));
    movement[2] -=int(keyIsDown(keyCode["S"]));
    // left right movement
    movement[0] +=int(keyIsDown(keyCode["D"]));
    movement[0] -=int(keyIsDown(keyCode["A"]));
    // up down movement
    movement[1] +=int(keyIsDown(keyCode["E"]));
    movement[1] -=int(keyIsDown(keyCode["Q"]));
    
    // normalize movemnt
    let movementMagnitude = sqrt(movement[0]*movement[0] + movement[1]*movement[1] + movement[2]*movement[2]);
    if(movementMagnitude){
        for(let i = 0; i<3; i++){
            movement[i] = movement[i]/movementMagnitude;
        }
    }
    movement *= camSpeed

    // rotation
    rotation[0] += (mouseX - pmouseX) * camSensitivity;
    rotation[1] += (mouseY - pmouseY) * camSensitivity;

    cam.move(movement[0], movement[1], movement[2]);

    cam.pan(rotation[0]);
    cam.tilt(rotation[1]);

    if(camFocus !== -1 && camFocus < body.all.length) {
        cam.lookAt(body.all[camFocus].x, body.all[camFocus].y, body.all[camFocus].z);
    }
}