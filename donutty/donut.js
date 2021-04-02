"use strict";

class TSScreen {
  #children = {};
  constructor(col, row, background = " ", colSpread = " ") {
    this.row = row;
    this.col = col;
    this.light = {
      x : -400,
      y : -50,
      z:25,
      near:25,
      far:-20
    }
    this.camCenter = new Point(0, 0,0);
    this.colSpread = colSpread;
    this.background = Number.NEGATIVE_INFINITY;
    this.init();
  }
  attachChild(child, id = `&${Object.keys(this.#children).length}`) {
    this.#children[id] = child;

  }
  getChildren() {
    return this.#children;
  }
  getChildPos(id){
    return this.#children['&0'].position
  }
  init() {
    this.display = new Array(this.row * this.col).fill(this.background);
    this.buffer = new Array(this.row * this.col).fill(this.background);
  }
  clear() {
    this.display = new Array(this.row * this.col).fill(this.background);
    this.buffer = new Array(this.row * this.col).fill(this.background);
  }
  update() {
    for (let child in this.#children) {
     
      this.#children[child].update(this);
    }
  }
  applyLight(x,y,z){
    // let colors =[
    //   '$', '@', '%', '#', '*', '/',
    //   '|', '(', ')', '1', '{', '}',
    //   '[', ']', '?', '-', '_', '+',
    //   '~', '<', '>', 'i', '!', 'l',
    //   'I', ';', ':', ',', '"', '^'
    // ] 
    
    let colors =[
      '@', '@', '@', '@', '@', '@', '@', '@',
      '@', '@',  '%', '%', '%',
      '%', '%', '%', '%', '#', '#',
      '#', '#', '#', '#', '#', '*', '*', '*',
      '*', '*', '*', '*', '*', '+', '+', '+',
      '+', '+', '+', '+', '+', '+', '=', '=',
      '=', '='
    ] 
    let nearFar= this.light.near-this.light.far
    let ratioz = Math.abs(this.light.z-z)/nearFar
    let ratioy = Math.abs(this.light.y-y)/nearFar
   
    let ratio = ratioz*ratioy
    return colors[Math.floor(colors.length*ratio)]
  }
  tsupdate(x, y,z, color = "@") {
    let scrnx = x + Math.ceil(this.col / 2 - this.camCenter.x);
    let scrny = y + 1 + Math.ceil(this.row / 2 - this.camCenter.y);
    let scrnpos = this.toScreenPos(scrnx, scrny)
    color = this.applyLight(x,y,z)
    
    if (!(scrnx > this.col || scrny > this.row || scrnx < 0 || scrny < 0)) {
      if(z>this.buffer[scrnpos] ){
        this.buffer[scrnpos] = z;
        this.display[scrnpos]= this.applyLight(x,y,z)
      }
    }
  }
  tsdraw() {
    for (let i = 0; i < this.row; i++) {
      this.replacePix(Number.NEGATIVE_INFINITY,this.display)
      let line = this.display
        .slice(i * this.col, i * this.col + this.col)
        .join(this.colSpread);


      
      console.log(line);
    }
  }
  replacePix(pixelval = '0',display){
    while(display.indexOf(pixelval)!== -1 ){
      display[display.indexOf(pixelval)]=' '
    }
  }
  toScreenPos(x, y) {
    return x - 1 + (y - 1) * this.col;
  }
}
class Point {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  drotate(theta, axis = "z", origin = { x: 0, y: 0, z: 0 }) {
    let rad = this.toRad(theta);
    let sintheta = Math.sin(rad);
    let costheta = Math.cos(rad);
    let [x, y, z] = [this.x-origin.x, this.y-origin.y, this.z-origin.z];
    if (axis === "x") {
      y = this.y * costheta - this.z * sintheta 
      z = this.y * sintheta + this.z * costheta 
      x = this.x
  
    } else if (axis === "y") {
      z = this.z * costheta - this.x * sintheta
      x = this.z * sintheta + this.x * costheta 
      y = this.y
    } else {
      x = this.x * costheta - this.y * sintheta 
      y = this.x * sintheta + this.y * costheta 
      z = this.z
    }
    [this.x, this.y, this.z] = [x+origin.x, y+origin.y, z+origin.z];
    //console.log(origin,'x:',Math.floor(this.x),'y:',Math.floor(this.y),'this.z',Math.floor(this.z))
  }
  toRad(angle) {
    return (angle * Math.PI) / 180;
  }
}
class Material {
  constructor(color = "@") {
    this.color = color;
  }
}
class Geometry {
  #segments = [];
  constructor(x = 0, y = 0, z = 0, segments = 1, points = [Point]) {
    this.position = new Point(x, y, z);
    for (let i of points) {
      this.#segments.push(new Point(i.x, i.y, i.z));
    }
  }
  getPos() {
    return this.position;
  }
  setPos(x, y, z) {
    this.position = { ...z };
  }
}
class TSentity {
  createTsEntity(
    geo = Geometry || [Point],
    mat = Material,
    position = (0, 0, 0)
  ) {
    if (typeof geo === [Point]) {
      this.geometry = new Geometry(...[, , , ,], position);
      this.material = mat;
    }
    return;
  }
}
class Circle extends Geometry {
  #segments = [];
  #radius;
  constructor(x, y, z,face='z', radius = 2, detail = 1, material = new Material()) {
    super(x, y, z);
    this.numSeg = radius * (6 * detail);
    this.#radius = radius;
    this.position = new Point(x, y, z);
   
    this.material = material;
    this.init(face);
  }

  init(face) {
    
    let [vecx, vecy, vecz] = [0,0, 0];
    if (face === "z") {
      vecx = this.#radius;
    } else if (face === "y") {
      vecz = this.#radius;
    } else vecy = this.#radius;
    for (let i = 0; i < this.numSeg; i++) {
      let deg = (360 / this.numSeg) * i;
      
      this.#segments.push(new Point(vecx,vecy,vecz));
      
      this.#segments[i].drotate(deg, face, this.position);
    
    }
    
  
    
  }
  getSegments() {
    return this.#segments;
  }
  setSegment(index,x,y,z) {
    this.#segments[index].x=x;
    this.#segments[index].y=y;
    this.#segments[index].z=z;
  }
  setRadius(rad) {
    this.#segments = [];
    this.#radius = rad;
    this.init();
  }
  rotateSegs(deg, face = "z", origin = Point) {
   
    for (let i in this.#segments) {
      this.#segments[i].drotate(deg, face, origin);
    }
  }
  update(canvasContext = TSScreen) {
    
    for (let i of this.getSegments()) {
      canvasContext.tsupdate(
        Math.floor(i.x),
        Math.floor(i.y),
        Math.floor(i.z),
        i.color
      );
      
    }
  }
}
class Donut extends Geometry{
  #segments=[]
  constructor(x,y,z,face = 'z',segments = 50,radius=10,segrad=6,material = new Material ()){
    super()
    this.position = new Point(x, y, z);
    this.numSeg= segments
    this.segrad=segrad
    this.radius = radius
    this.face = face
    this.material = material
    this.init()
  }
  init(){
    this.calcSegFace();
    for(let i = 0 ;i<this.numSeg;i++){
      let degree = (360/this.numSeg)*i;
      
      this.#segments.push(new Circle(...this.calcinitVec(),this.segface,this.segrad))
      this.#segments[i].rotateSegs(degree,'z',this.position)
    }
   
  }
  calcinitVec(){
    let [vecx, vecy, vecz] = [0,0, 0];
    
    if (this.face === "z") {
      vecx = this.radius;
    } else if (this.face === "y") {
      vecz = this.radius;
    } else vecy = this.radius;
    return [vecx,vecy,vecz]
  }

  calcSegFace(){
    
    if(this.face === 'z'){
      this.segface =this.segface = 'y'
    } else if (this.face=== 'x'){
      this.segface = 'y'
    }else this.segface = 'z'
  }
  update(canvasContext = TSScreen) {
    for (let i of this.#segments) {
      i.update(canvasContext)
    }
    
}
donutate(deg,axis = 'y',origin = this.position){
  for(let i of this.#segments){
    i.rotateSegs(deg,axis,origin)
  }
}
}



function main(){
  const args = [50,50,20]
  
  
  const canvas = new TSScreen(args[0], args[1]);
  const d1 = new Donut(0,0,0,'z',200,12)

  //d1.donutate(45,'x',d1.position)
  canvas.attachChild(d1)

  canvas.update()
  canvas.tsdraw()
  let time = 0; 
  let interval = setInterval(()=>{
  
    //console.log('\x1Bc');
    console.clear()
    d1.donutate(15,'y',d1.position)
    d1.donutate(10,'x',d1.position)
    d1.donutate(-10,'z',d1.position)
    canvas.clear();
    canvas.update();
    canvas.tsdraw();
    
  
    time++
    if(time === 1000) clearInterval(interval)
  },100)
  
}
main()




