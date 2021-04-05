import * as THREE from "three";

import { hud } from "./hud";
import fragmentShader from "./mandelbrotfrag.glsl";
import Stats from "stats-js"
const canvas = document.querySelector("#c");
let i = 0;
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.autoClearColor = false;
//let mhud = new hud();
let mhud = new hud();
let stats = new Stats();

stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );
stats.dom.style.left = "88vw"
const camera = new THREE.OrthographicCamera(
	-1, // left
	1, // right
	1, // top
	-1, // bottom
	-1, // near,
	1 // far
);
const scene = new THREE.Scene();
const plane = new THREE.PlaneGeometry(2, 2);
const mouse = new THREE.Vector2();
const uniforms = {
	iResolution: { value: new THREE.Vector3() },
	iTime: { value: 0 },
	maxIter: { value: 255.0 },
};

let mouseIsDown = false;
canvas.addEventListener("mousedown", onMouseEvent, false);
canvas.addEventListener("mouseup", function () {
	mouseIsDown = false;
});
canvas.addEventListener("mousemove", onMouseMove, false);

const material = new THREE.ShaderMaterial({
	fragmentShader,
	uniforms,
});
inithud();
scene.add(new THREE.Mesh(plane, material));

function resizeRendererToDisplaySize(renderer) {
	const canvas = renderer.domElement;
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	const needResize = canvas.width !== width || canvas.height !== height;
	if (needResize) {
		renderer.setSize(width, height, false);
		console.log(width, height);
	}
	return needResize;
}

function render(time) {
	time *= 0.001; // convert to seconds
  stats.begin();
	resizeRendererToDisplaySize(renderer);

	const canvas = renderer.domElement;
	uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
	uniforms.iTime.value = time;

	renderer.render(scene, camera);
  stats.end();
	requestAnimationFrame(render);
}

requestAnimationFrame(render);

function onMouseEvent(event) {
	var e = event.button;
	mouseIsDown = true;
	if (e == 0) {
		let interval = setInterval(() => {
			if (mouseIsDown == false) clearInterval(interval);
			uniforms.maxIter.value = uniforms.maxIter.value += 10;

			console.log(uniforms.maxIter);
		}, 100);
	} else if (e == 1) {
		let interval = setInterval(() => {
			if (mouseIsDown == false) clearInterval(interval);
			uniforms.maxIter.value > 5 ? (uniforms.maxIter.value -= 10) : null;

			console.log(uniforms.maxIter);
		}, 100);
	}
}
function onMouseMove(event) {
	event.preventDefault();
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function inithud() {
	for (let i of Object.keys(uniforms)) {
		let val = "";
		if (typeof uniforms[i].value == "object") {
			Object.keys(uniforms[i].value).forEach((el) => {
				val += el + ": " + uniforms[i].value[el] + " ";
			});
		} else val = uniforms[i].value;
		let index = mhud.addText(`${val}`);
		mhud.child[index].setAttribute("id", i);
		mhud.child[index].innerHTML = `${mhud.child[index].id}: ${val}`;
	}
}
