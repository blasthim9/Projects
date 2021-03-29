let inc = 0.04;
let binc = 1;
let donk = 0;
let time = 0;
let toggle = false;
let transition = 1;
let coggle = false;
const camPos = {
  x: 0,
  y: 0,
  z: 0,
};
const scale = {
  x: 15,
  y: (async function () {
    await setTimeout(function () {
      scale.y = scale.x;
    });
  })(),

  stretch: function (width, height) {
    width > height
      ? (this.y = height / (width / this.x))
      : (this.x = width / (height / this.y));
  },
};

let cols, rows;
let mousehud = document.createElement("div");
let canvas;
let cam;

let zinc = 0;
document.body.appendChild(mousehud);
function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  //scale.stretch(width,height)
  canvas.id('wave')
  cam = createCamera();
  [camPos.x, camPos.y, camPos.z] = [width, height - 1000, 3000];

  cam.setPosition(camPos.x, camPos.y, camPos.z);
  //cam.lookAt(width / 2, height / 2, 0); 
  cols = floor(windowWidth / scale.x);
  rows = floor(height / scale.y);
  rows = 2;
  background("BLACK");
  cam.lookAt(width, height - 1000, 0);
}

function draw() {
  //cols++;
  zinc += 0.008;
  orbitControl();
  if (toggle == true) {
    time += 0.00005;
  }
  if (keyIsDown(87)) {
    rows++;
  }
  if (keyIsDown(69)) {
    cols++;
  }
  if (keyIsDown(83)) {
    rows--;
  }
  if (keyIsDown(68)) {
    cols--;
  }
  if (keyIsDown(81)) {
    coggle = false;
    console.log("coggle is false");
  }
  if (keyIsDown(17)) {
    toggle = true;
    coggle = true;
  }
  // if (coggle === true) {
  //   camPos.y+=15;
  //   camPos.z+=25;
  //   camPos.x+=20;
  //   cam.setPosition(camPos.x, camPos.y, camPos.z);

  //   cam.lookAt(width / 2, camPos.y, 600);
  // }
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
  // if(keyIsDown(CONTROL)){
  //   background("#FF7F50");
  // }
  background("#4A5B6E");
  let yoff = 0;

  for (let y = 0; y < rows; y++) {
    let xoff = 0;

    for (let x = 0; x < cols; x++) {
      let noiseparam = noise(xoff, yoff, zinc) * 255;

      blendMode(BLEND);
      noStroke();
      if (coggle === true) {
        rotateY(noise(xoff, yoff, zinc) / 100);
        rotateX(noise(xoff, yoff, zinc) / 5);
        rotateZ(noise(xoff, yoff, zinc) / 100);
        donk++;
      }

      let vec = new p5.Vector(x * scale.x, y * scale.y);
      if (toggle === true) {
        translate(
          0,
          0,
          (noiseparam / 1000 - (noiseparam / 1000) * transition) * 3
        );
        vec.y += noiseparam * 3 - noiseparam * 3 * transition;
        if (transition > 0) {
          transition = transition - 0.000005;
        } else {
          transition = 0;
        }
      }
      colorMode(RGB, 255, 255, 255);
      fill(
        Math.abs(Math.cos((noiseparam / 255) * 2 * Math.PI)) * 100,
        0,
        Math.abs(Math.sin((noiseparam / 255) * 2 * Math.PI)) * 105,
        noiseparam
      );

      rect(vec.x, vec.y, scale.x, scale.y);

      rect(2 * scale.x * cols - vec.x - scale.x, vec.y, scale.x, scale.y);

      rect(vec.x, 2 * scale.y * (rows - 1) - vec.y + scale.y, scale.x, scale.y);

      rect(
        2 * scale.x * (cols - 1) - vec.x + scale.x,
        2 * scale.y * (rows - 1) - vec.y + scale.y,
        scale.x,
        scale.y
      );
      xoff += inc;
    }

    yoff += inc;
  }
  //cam.lookAt(width, height, 0);
}
