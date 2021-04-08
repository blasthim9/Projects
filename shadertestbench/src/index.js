import * as THREE from "three";
import * as dat from "dat.gui";
import fragmentShader from "./mandelbrotfrag.glsl";
import vertexShader from "./mbrot.glsl";
import Stats from "stats-js";

let stats, gui, mbrot, scene, material, mouse, renderer, canvas, camera;
let mouseIsDown = false;
let input;
init();

render();

function init() {
	canvas = document.querySelector("#c");

	renderer = new THREE.WebGLRenderer({ canvas });
	renderer.autoClearColor = false;
	stats = new Stats();

	stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
	document.body.appendChild(stats.dom);

	camera = new THREE.OrthographicCamera(
		-1, // left
		1, // right
		1, // top
		-1, // bottom
		-1, // near,
		1 // far
	);
	console.log();
	scene = new THREE.Scene();
	const plane = new THREE.PlaneGeometry(2, 2);
	mouse = new THREE.Vector2();

	const uniforms = {
		aspect: { value: canvas.width / canvas.height },
		iTime: { value: 0 },
		maxIter: { value: 250.0 },
		ucenter: { value: new THREE.Vector2(0.0, 0.0) },
		scale: { value: 4.0 },
		Area: { value: new THREE.Vector4(0.0, 0.0, 4.0, 4.0) },
		numzoom: { value: 0 },
		zoom: { value: 1 },
		startuv: { value: new THREE.Vector2(0.0, 0.0) },
		mouse: { value: new THREE.Vector2() },
	};

	canvas.addEventListener("mousedown", onMouseEvent, false);
	canvas.addEventListener("mouseup", function () {
		mouseIsDown = false;
	});

	document.addEventListener("keydown", onKeyEvent);
	//canvas.addEventListener('keydown', onKeyEvent);
	//WTF??????????????????
	material = new THREE.ShaderMaterial({
		uniforms: uniforms,
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
	});
	mbrot = new THREE.Mesh(plane, material);

	mbrot.util = {
		posx: 0,
		posy: 0,
		scaleX: 0,
		scaleY: 0,
		mouse: new THREE.Vector2(0, 0),
		scale: 4,
		aspect: 1,
		laggingpos: new THREE.Vector2(0, 0),
		laggingscale: new THREE.Vector2(0, 0),
		scalefunc: function (canvas) {
			this.aspect = canvas.width / canvas.height;
			[this.scaleX, this.scaleY] = [this.scale, this.scale];

			if (this.aspect > 1.0) {
				this.scaleY /= this.aspect;
			} else {
				this.scaleX *= this.aspect;
			}
			this.laggingpos.lerpVectors(
				this.laggingpos,
				new THREE.Vector2(this.posx, this.posy),
				0.03
			);
			this.laggingscale.lerpVectors(
				this.laggingscale,
				new THREE.Vector2(this.scaleX, this.scaleY),
				0.03
			);
			return {
				x: this.laggingpos.x,
				y: this.laggingpos.y,
				w: this.laggingscale.x,
				h: this.laggingscale.y,
			};
		},
	};

	mbrot.updateScreen = function (canvas = { width: 0, height: 0 }) {
		const set = this.util.scalefunc(canvas);

		this.material.uniforms.Area.value.set(set.x, set.y, set.w, set.h);
	};

	mbrot.updateScreen(canvas);
	scene.add(mbrot);
	gui = guiInit();
}

function resizeRendererToDisplaySize(renderer) {
	const canvas = renderer.domElement;
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;

	const needResize = canvas.width !== width || canvas.height !== height;
	if (needResize) {
		renderer.setSize(width, height, false);

		console.log(width, height, "hit");
	}
	return needResize;
}

function render(time) {
	time *= 0.001; // convert to seconds
	stats.begin();
	resizeRendererToDisplaySize(renderer);
	gui.updateDisplay();
	const canvas = renderer.domElement;
	mbrot.updateScreen(canvas);
	mbrot.material.uniforms.iTime.value = time;
	gui.width = canvas.width / 4;

	renderer.render(scene, camera);
	stats.end();
	//console.log(hello,'123')
	requestAnimationFrame(render);
}
function guiInit() {
	let gui = new dat.GUI();
	gui.add(mbrot.material.uniforms.maxIter, "value").min(0).max(15000).step(10);
	gui.add(mbrot.material.uniforms.Area.value, "x");
	gui.add(mbrot.material.uniforms.Area.value, "y");
	gui.add(mbrot.material.uniforms.Area.value, "z");
	gui.add(mbrot.material.uniforms.Area.value, "w");
	gui.add(mbrot.material.uniforms.numzoom, "value");
	gui.__controllers.forEach((el) => el.step(0.000001));
	return gui;
}
function onMouseEvent(event) {
	var e = event.button;
	mouseIsDown = true;
	if (e == 0) {
		let interval = setInterval(() => {
			if (mouseIsDown == false) clearInterval(interval);
			mbrot.util.scale *= 0.99;
		}, 10);
	} else if (e == 1) {
		let [normx, normy] = [
			event.clientX / canvas.width,
			1 - event.clientY / canvas.height,
		];

		mbrot.util.posx -= (0.5 - normx) * mbrot.util.scaleX;
		mbrot.util.posy -= (0.5 - normy) * mbrot.util.scaleX;
	}
}
function onKeyEvent(event) {
	let e = event.key;
	if (e === "e") {
		mbrot.util.scale *= 1.01;
	} else if (e === "q") {
		mbrot.util.scale *= 0.99;
		console.log("thiaisd");
	} else if (e === "d") {
		mbrot.util.posx += 0.01 * mbrot.util.scale;
	} else if (e === "s") {
		mbrot.util.posy -= 0.01 * mbrot.util.scale;
	} else if (e === "a") {
		mbrot.util.posx -= 0.01 * mbrot.util.scale;
	} else if (e === "w") {
		mbrot.util.posy += 0.01 * mbrot.util.scale;
	} else if (e === "r") {
		mbrot.material.uniforms.maxIter.value += 3;
	} else if(e==="z"){
		mbrot.material.uniforms.numzoom.value++;
	}
}
