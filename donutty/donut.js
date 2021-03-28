"use strict";

//y+x*n

function Screen() {
  this.scrnheight = 15;
  this.pxcount = Math.pow(this.scrnheight, 2);
  this.pixel = new Array(this.pxcount).fill("#");
  this.changeSize = function (newHeight, newFill = "#") {
    this.scrnheight = newHeight;
    this.pxcount = Math.pow(newHeight, 2);
    this.pixel = new Array(this.pxcount).fill(newFill);
  };
  this.draw = function () {
    for (let i = 0; i < this.scrnheight; i++) {
      let row = this.pixel.slice(
        i * this.scrnheight,
        i * this.scrnheight + this.scrnheight
      );
      console.log(row.join("  "));
    }
  };
  this.Init = function(){
      console.log('screen initialized')
  }
  this.Init()
}
function Section(x, y, z = 0, r = 2, col = "+") {
  this.x = x;
  this.y = y;
  this.z = z;
  this.r = r;
  this.col = col;
}

function Donut(numsec=30,donutradius=4) {
  this.numsec = numsec;
  this.donutradius = donutradius;
  this.sections;
  this.setGeometry = function (numsec = 30, donutradius = 4) {
    this.numsec = numsec;
    this.donutradius = donutradius;
    this.Init();
  };
  this.getGeometry = function () {
    return [this.numsec, this.donutradius];
  };
  this.getSections = function () {
    return [...this.sections];
  };
  this.Init = function () {
    this.sections = new Array();
    for (let i = 0; i < this.numsec; i++) {
      let theta = ((2 * Math.PI) / this.numsec) * i;
      let x = Math.floor(Math.cos(theta) * this.donutradius);
      let y = Math.floor(Math.sin(theta) * this.donutradius);
      let z = 0;

      this.sections.push(new Section(x, y, z));
    }
    console.log("donut initialized");
  };
  this.Init();
}
let scr1 = new Screen();
let d1 = new Donut();

