import * as THREE from "three";
import * as dat from "dat.gui";
import fragmentShader from "./mandelbrotfrag.glsl";
import vertexShader from "./mbrot.glsl";
import juliaShader from "./juliaset.glsl";
import Stats from "stats-js";

let stats, gui, mbrot, scene, material, mouse, renderer, canvas, camera;
let mouseIsDown = false;
let input,
	julia,
	jbool = false,
	jshader;
init();

render();

function init() {
	canvas = document.querySelector("#c");

	renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
	renderer.autoClearColor = false;
	stats = new Stats();

	stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
	document.body.appendChild(stats.dom);

	camera = new THREE.OrthographicCamera(
		-1, // left
		1, // right
		1, // top
		-1, // bottom
		-10, // near,
		100 // far
	);
	let config = {
		test: {
			scale: Number(0.010001).toFixed(20),
			posx: 0.437924,
			posy: 0.341892,
			maxIter: 2000,
		},
		live: new THREE.Vector4(0.0, 0.0, 1.0, 4.0),
		mode: "test",
	};
	console.log();
	scene = new THREE.Scene();
	const plane = new THREE.PlaneGeometry(2, 2,10,10);
	mouse = new THREE.Vector2();

	const uniforms = {
		aspect: { value: canvas.width / canvas.height },
		iTime: { value: 0 },
		maxIter: { value: 255 },

		Area: { value: new THREE.Vector4(0.0, 0.0, 1.0, 4.0) },
		numzoom: { value: 0 },
		zoom: { value: 1 },
		startuv: { value: new THREE.Vector2(0.0, 0.0) },
		mouse: { value: new THREE.Vector2() },
	};

	canvas.addEventListener("mousedown", onMouseEvent, false);
	canvas.addEventListener("mouseup", function () {
		mouseIsDown = false;
	});
	canvas.oncontextmenu = function (e) {
		e.preventDefault();
		e.stopPropagation();
	};

	document.addEventListener("keydown", onKeyEvent);

	material = new THREE.ShaderMaterial({
		uniforms: uniforms,
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
	});

	jshader = new THREE.ShaderMaterial({
		uniforms: uniforms,
		vertexShader: vertexShader,
		fragmentShader: juliaShader,
	});
	
	if (jbool === true) {
		mbrot = new THREE.Mesh(plane, jshader);
	} else mbrot = new THREE.Mesh(plane, material);
	let wmbrot = new THREE.Mesh(plane, new THREE.MeshBasicMaterial());
	wmbrot.material.wireframe = true;
	wmbrot.material.depthTest= false;
	wmbrot.position.set(0,0,-2)
	mbrot.position.set(0,0,1)
	mbrot.material.transparent = false;
	
	
	mbrot.util = {
		posx: 0.0,
		posy: 0.0,
		scaleX: 0,
		scaleY: 0.0,
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
				new THREE.Vector2(
					Number(this.posx).toFixed(20),
					Number(this.posy).toFixed(20)
				),
				0.03
			);
			this.laggingscale.lerpVectors(
				this.laggingscale,
				new THREE.Vector2(
					Number(this.scaleX).toFixed(20),
					Number(this.scaleY).toFixed(20)
				),
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
	mbrot.rescaleLerp = function () {
		this.util.laggingscale.x = this.util.scaleX;
		this.util.laggingscale.y = this.util.scaleY;
		this.util.laggingpos.x = this.util.posx;
		this.util.laggingpos.y = this.util.posy;
	};
	//scene.add(wmbrot);
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
		mbrot.updateScreen(canvas);
		mbrot.rescaleLerp();
		console.log(width, height, "hit");
	}
	return needResize;
}

function render(time) {
	requestAnimationFrame(render);
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
}
function guiInit() {
	let gui = new dat.GUI();
	gui.add(mbrot.material.uniforms.maxIter, "value").min(0).max(1000).step(1);
	gui.add(mbrot.material.uniforms.Area.value, "x");
	gui.add(mbrot.material.uniforms.Area.value, "y");
	gui.add(mbrot.material.uniforms.Area.value, "z");
	gui.add(mbrot.material.uniforms.Area.value, "w");
	gui.add(mbrot.material.uniforms.numzoom, "value");
	gui.__controllers.forEach((el) => el.step(0.000001));
	return gui;
}
function onMouseEvent(event) {
	let canvasEvent = new Event("canvasEvent");

	var e = event.button;

	console.log(e);
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
	} else if (e == 2) {
		let interval = setInterval(() => {
			if (mouseIsDown == false) clearInterval(interval);
			mbrot.util.scale *= 1.01;
		}, 10);
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
	} else if (e === "z") {
		mbrot.material.uniforms.numzoom.value++;
	}
}
