let inc = 0.03;
let binc = 1;
let donk = 0;
let time = 0;
let toggle = false;
let transition = 1;
let coggle = false;
let btn1toggle = false;
let img;

const camPos = {
  x: 0,
  y: 0,
  z: 0,

  updatePos: function (cols, rows) {
    [this.x, this.y, this.z] = [cols * scale.x, rows * scale.y, 3000];
  },
};

const scale = {
  x: 12,
  y: 5,
};

let cols, rows;



let zinc = 0;
let cam;
let sliderxtaper;
let sliderx;
let input;
let slidery;
let buttons = [];
let canvas;
let ctx
function setup() {
  //canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  //scale.stretch(width,height)
  //ctx.getContex('2d')
  canvas =createCanvas(windowWidth, windowHeight, WEBGL);
  
  canvas.style('z-index','0')
  canvas.id("wave");
  cols = 200;
  rows = 200;
  
  cam = createCamera();
  scale.y = random(5,9)
  camPos.updatePos(cols, rows);
  cam.setPosition(camPos.x, camPos.y, 5000);
  cam.lookAt(camPos.x, camPos.y, camPos.x, camPos.z);
  setCamera(cam);
  
  slidery = createSlider(0, 255, 0, 0);
  slidery.position(-500, 10);
  slidery.style("width", "80px");
  slidery.value(random(0,255))
  sliderx = createSlider(0, 255, 0, 0);
  sliderx.position(-500, 25,-10);
  sliderx.style("width", "80px");
  sliderx.value(random(0,255))
  
  sliderxtaper = createSlider(-500, 100, 3.14, 0);
  sliderxtaper.position(-500, 40);
  sliderxtaper.style("width", "300px");
  buttons.push(
    createButton("play").position(
      sliderxtaper.position().x + 300,
      sliderxtaper.position().y,-10
    )
  );
  
 


  input = createInput();
  input.position(-500, 65);
  input.style("width","30px")
  
  
  // frameRate(20)
  // createLoop({duration:3, gif:true})
  
}

function draw() {
  //cols++;
  zinc += 0.008;
  input.value(sliderxtaper.value());
  //orbitControl();
  time =time+ 0.05;
  if (toggle == true) {
    time =time+ 0.05;
  }
  buttons[0].mousePressed(()=>{play(sliderxtaper,btn1toggle,-100,100,.1)})
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
  // if(keyIsDown(CONTROL)){
  //   background("#FF7F50");
  // }
  background("#4A5B6E");
  let yoff = time
  for (let y = 0; y < rows; y++) {
    let xoff = time

    for (let x = 0; x < cols; x++) {
      let noiseparam = noise(xoff, yoff, zinc) * 255;

      blendMode(BLEND );
      noStroke();
      if (coggle === true) {
        rotateY(noise(xoff, yoff, zinc) / 10);
        rotateX(noise(xoff, yoff, zinc) / input.value());
        //rotateZ(noise(xoff, yoff, zinc) / 95);
        donk++;
      }

      let vec = new p5.Vector(x * scale.x, y * scale.y);

      if (toggle === true) {
        translate(
          0,
          0,
          (noiseparam / 1000 - (noiseparam / 1000) * transition) * .2
        );
        vec.y += noiseparam * 3;
        vec.x += noiseparam * 3;
        
        if (transition > 0) {
          transition = transition - 1;
        } else {
          transition = 0;
        }
      }
      colorMode(RGB, 255, 255, 255);
      fill(
        Math.abs(Math.cos((noiseparam / 255) * 2 * Math.PI)) * 100,
        0,
        Math.abs(Math.sin((noiseparam / 255) * 2 * Math.PI)) * 100,
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

function keyPressed() {
  if (keyIsDown(87)) {
    rows++;
    camPos.updatePos(cols, rows);
    cam.setPosition(camPos.x, camPos.y, camPos.z);
    cam.lookAt(camPos.x, camPos.y, 0);
  }
  if (keyIsDown(69)) {
    cols++;
    camPos.updatePos(cols, rows);
    cam.setPosition(camPos.x, camPos.y, camPos.z);
    cam.lookAt(camPos.x, camPos.y, 0);
  }
  if (keyIsDown(83)) {
    rows--;
    camPos.updatePos(cols, rows);
    cam.setPosition(camPos.x, camPos.y, camPos.z);
    cam.lookAt(camPos.x, camPos.y, 0);
  }
  if (keyIsDown(68)) {
    cols--;
    camPos.updatePos(cols, rows);
    cam.setPosition(camPos.x, camPos.y, camPos.z);
    cam.lookAt(camPos.x, camPos.y, 0);
  }
  if (keyIsDown(81)) {
    coggle = !coggle;
    toggle = false;
    
  }
  if (keyIsDown(17)) {
    coggle = false;
    toggle = !toggle;
    
  }
}

function play(slider, btntoggle, min = -100, max = 100, inc = 0.001) {
  btntoggle = !btntoggle;

  
  if (slider.value() == max) {
    max = min;
    inc = -inc;
    
}
slider.value(slider.value() + inc);
}
