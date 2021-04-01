"use strict";
var term = require( 'terminal-kit' ).terminal ;

term.grabInput( { mouse: 'motion' } ) ;

term.on( 'mouse' , function( name , data ) {
    console.log( "'mouse' event:" , name , data ) ;
} ) ;
class TSScreen {
  #children = {};
  constructor(col, row, render = "3d", background = "#", colSpread = " ") {
    this.row = row;
    this.col = col;
    this.camCenter = new Point(0, 0);
    this.colSpread = colSpread;
    this.background = background;
    this.init();
  }
  attachChild(child, id = `&${Object.keys(this.#children).length}`) {
    this.#children[id] = child;
  }
  getChildren() {
    return this.#children;
  }
  init() {
    this.display = new Array(this.row * this.col).fill(this.background);
  }
  clear() {
    this.display = new Array(this.row * this.col).fill(this.background);
  }
  update(){
    for(let child in this.#children){
      this.#children[child].update(this);
    }
  }
  tsupdate(x,y,z,color='@') {
    let scrnx = x + Math.ceil(this.col / 2 - this.camCenter.x);
    let scrny = y + Math.ceil(this.row / 2 - this.camCenter.y);
    if (!(scrnx >= this.col || scrny >= this.row || scrnx <= 0 || scrny <= 0)) {
      this.display[this.toScreenPos(scrnx, scrny)] = color;
    }
  }
  tsdraw() {
    for (let i = 0; i < this.row; i++) {
      let line = this.display
        .slice(i * this.col, i * this.col + this.col)
        .join(this.colSpread);

      if (i === Math.floor(this.row / 2)) {
        let halfway = Math.floor(line.length / 2);

        let result =
          line.slice(0, halfway - 1) +
          "\x1b[36m" +
          line.slice(halfway - 1, halfway) +
          "\x1b[0m" +
          line.slice(halfway, line.length);
        console.log(result, Math.floor(line.length / 2), line.length);
      } else console.log(line);
    }

    console.log("endframe\n");
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
    let [x, y, z] = [this.x, this.y, this.z];
    if (axis === "x") {
      y = this.y * costheta - this.z * sintheta + origin.y;
      z = this.z * sintheta + this.z * costheta + origin.z;
    } else if (axis === "y") {
      x = this.x * costheta + this.z * sintheta + origin.x;
      z = this.z * costheta + this.x * sintheta + origin.z;
    } else {
      x = this.x * costheta - this.y * sintheta + origin.x;
      y = this.x * sintheta + this.y * costheta + origin.y;
    }
    [this.x, this.y, this.z] = [x, y, z];
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
  bindTo(canvasContext) {
    this.canvasContext = canvasContext;
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
  constructor(x, y, z, radius = 2, detail = 1, material = new Material()) {
    super(x, y, z);
    this.numSeg = radius * (6 * detail);
    this.#radius = radius;
    this.position = new Point(this.x, this.y, this.z);
    this.material = material;
    this.init();
  }

  init() {
    for (let i = 0; i < this.numSeg; i++) {
      let deg = (360 / this.numSeg) * i;

      //example circle position [2,0,0] point [2,0,0] => rotate 2,0,0 around origin 2,0,0
      this.#segments.push(new Point(this.#radius, 0, 0));

      this.#segments[i].drotate(deg, "z", this.position);
    }
  }
  getSegments() {
    return this.#segments;
  }
  setRadius(rad) {
    this.#segments = [];
    this.#radius = rad;
    this.init();
  }
  update(canvasContext = TSScreen) {
    for (let i of c1.getSegments()) {
      canvasContext.tsupdate(Math.floor(i.x), Math.floor(i.y),Math.floor(i.z),this.material.color);
    }
  }
}

let canvas = new TSScreen(20,20);
let c1 = new Circle(0, 0, 0, 5, 1);
canvas.attachChild(c1);
console.log(canvas.getChildren());



canvas.update();

canvas.tsdraw();


