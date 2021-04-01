"use strict";


class Screen{
  constructor(col,row,colSpread = ' '){
    this.row = row
    this.col = col
    this.camCenter = new Point(0,0)
    this.Init()
    this.colSpread = ' '
  }
  Init(){
    this.display = new Array(this.row*this.col).fill('#')
    //this.draw()
  }
  tsupdate(x,y,color= '@'){
    let scrnx = x+ this.col/2-this.camCenter.x
    let scrny = y+ this.row/2-this.camCenter.y
    this.display[this.toScreenPos(scrnx,scrny)] = color
  }
  tsdraw(){
    
    for(let i = 0; i<this.row;i++){
      let line = this.display.slice(i*this.row,(i*this.row+this.col)).join(this.colSpread)
      if(i===this.row/2){
        
        let result = line.slice(0,this.colSpread/2)+'\x1b[1m'
        console.log(line.length,result)
      }
      //console.log(line)
      
    }
    console.log('\n')
  }
  toScreenPos(x,y){
    return((x-1)+(y-1)*this.row)
  }
}
class Point {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  drotate(theta, axis = "z", origin = { x: 0, y: 0, z: 0 }) {
    let rad = this.toRad(theta);
    let sintheta = Math.sin(rad);
    let costheta = Math.cos(rad);
    let [x,y,z] = [this.x,this.y,this.z]
    if (axis === "x") {
      y = this.y * costheta - this.z * sintheta+origin.y;
      z = this.z * sintheta + this.z * costheta+origin.z;
    } else if (axis === "y") {
      x = this.x * costheta + this.z * sintheta+origin.x;
      z = this.z * costheta + this.x * sintheta+origin.z;
    } else {
      x = (this.x * costheta) - (this.y * sintheta)+origin.x;
      y = (this.x * sintheta) + (this.y * costheta)+origin.y;
      
      //fix to degrees formula 
    }
    [this.x,this.y,this.z]=[x,y,z]
    
  }
  toRad(angle) {
    return (angle * Math.PI/180);
  }
}

class Geometry {
  constructor(x = 1, y = 1, z = 1) {
    this.x=x
    this.y=y
    this.z=z
    this.position = new Point(x, y, z);

  }
  getPos() {
    return this.position;
  }
  setPos(x, y, z) {
    this.position = { ...z };
  }
}
class Circle extends Geometry {
  #segments = [];
  constructor(x, y, z, radius = 2, numSeg = 20) {
    super(x,y,z);
    
    this.radius = radius;
    this.numSeg = numSeg;
    this.position = new Point(this.x,this.y,this.z)
    
    this.init();
  }

  init() {
    for (let i = 0; i < this.numSeg; i++) {
      let deg = (360/this.numSeg)*i

      //example circle position [2,0,0] point [2,0,0] => rotate 2,0,0 around origin 2,0,0
      this.#segments.push(new Point(this.radius,0,0));
      
      this.#segments[i].drotate(deg,'z',this.position)
      console.log(this.#segments[i])
     
    }
  }
  getSegments() {
    return this.#segments;
  }
}

let c1 = new Circle(0,0,0,4,30);
let geo = new Geometry()
let canvas = new Screen(20,20) //top left is (0,0)
for(let i of c1.getSegments()){
 
  console.log(Math.floor(i.x),Math.floor(i.y))
  canvas.tsupdate(Math.floor(i.x),Math.floor(i.y))

}
canvas.tsdraw()
let arr = [1,2,3,4,5]
