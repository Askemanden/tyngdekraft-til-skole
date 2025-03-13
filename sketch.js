function setup() {
  createCanvas(400, 400);
}

let paused = true;

const startMenu = new UIMenu([[]],undefined,undefined,undefined,"rgb(195, 197, 202)")
startMenu.addItem(createButton("Start").mouseClicked(() => {paused = false; startMenu.hide()}));

function draw() {
  background(220);
}
