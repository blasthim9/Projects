console.log("indexjs");
let styleOps = function(prop, op, val,valtype='') {
    prop, op, val;
    
    console.log(this)
    console.log(prop)
    this.prop = eval(parseInt(prop) + op + val)+valtype
  }
let canvases;
let elprobe = setInterval(function () {
  canvases = document.getElementsByTagName("canvas");

  if (canvases) clearInterval(elprobe), console.log("got", canvases);
}, 3000);

let btn = document.createElement("button");
document.body.appendChild(btn);
btn.style.position = "absolute";
btn.style.zIndex = "1";

btn.style.left = "100px";
console.log(btn.style)
styleOps.call(btn.style,btn.style.left, "+", 200,"px");


console.log(btn.style.left)