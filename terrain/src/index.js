import * as THREE from "three";
import * as dat from "dat.gui";
import Stats from "stats-js";
import {
	BufferGeometry,
	EventDispatcher,
	RGBAFormat,
	SphereGeometry,
	Vector3,
	OrbitControls
} from "three";

let canvas,
	renderer,
	camera,
	scene,
	axesHelper,
	orbitControl,
	floor,
  orbit,
	gui,
	gridhelper,
	sun,
  helper,
	atmo,
  cube,
  layer,

	devstorage = [];
const objects = [];
let guilight;
init();

initEvents();
render();
function init() {
	scene = new THREE.Scene();
	canvas = document.querySelector("#terrain");
	renderer = new THREE.WebGL1Renderer({
		canvas: canvas,
		alpha: false,
		antialias: true,
	});
	renderer.autoClearColor = false;
	camera = new THREE.PerspectiveCamera(
		90,
		canvas.clientWidth / canvas.clientHeight,
		.1,
		5000
	);
	renderer.setSize(canvas.clientWidth, canvas.clientHeight);

	camera.position.z = 20
	camera.position.y=901

	
	console.log(camera.position)
	camera.lookAt(0,900,0)
	scene.updateMatrix()
	camera.up(0,1,0)
	orbitControl = new OrbitControls(camera, renderer.domElement);
	

	axesHelper = new THREE.AxesHelper(5);
	gridhelper = new THREE.GridHelper(5, 10);
	const floorgeo = new THREE.SphereGeometry(900,1000,1000);
	const floormat = new THREE.MeshStandardMaterial({
		color: new THREE.Color(0x9b7653),
		wireframe: false,
		visible: true,

	
	});
	
	
	atmo = new THREE.HemisphereLight(0x0080ff, 0xff5000, .3);
	sun = new THREE.DirectionalLight(0xfd5e53, 1);
	
  orbit = new THREE.Mesh(new THREE.SphereGeometry(1,1,1),new THREE.MeshBasicMaterial({
    visible:false,
  }))
	helper = new THREE.DirectionalLightHelper(sun, 2);

	scene.add(atmo);
	floor = new THREE.Mesh(floorgeo, floormat);
	floor.position.set(0, 0, 0);

	

	scene.add(axesHelper);
	
  
  helper.update()
	scene.add(gridhelper);
	objects.push(floor);
	const geometry = new THREE.SphereGeometry(1000, 1000, 1000);
	const material = new THREE.MeshStandardMaterial({
		emissive: new THREE.Color(0x6c7076),
		wireframe: false,
		side: THREE.DoubleSide,
		fog: false,
		transparent: true,
		opacity: .6,
    refractionRatio: 1,
	});

	layer = new THREE.Mesh(geometry, material);
	layer.material.side = THREE.DoubleSide;
	scene.add(layer);
	scene.add(floor);
	gui = new dat.GUI();
	gui.add(floor.material, "wireframe").name("floorwireframe");
	camera.aspect = 1.5;
	//objects.push(cube);
  orbit.add(sun)
  sun.position.set(2000, 0, 0);
  scene.add(helper)
  scene.add(orbit)
	guilight = gui.add(layer.rotation, "z").step(1);
  sun.intensity = .3
	makeCube();
}

function makeCube() {
	let mat = new THREE.MeshPhongMaterial({
		color: new THREE.Color("black"),
		wireframe: false,
	});
	let geo = new THREE.BoxGeometry(1, 6, 1, 20, 20);
	let cube = new THREE.Mesh(geo, mat);
	cube.position.set(0, 903, 0);
  
	floor.add(cube);
	objects.push(cube);
  
}

function onWindowResize() {
	camera.aspect = canvas.clientWidth/ canvas.clientHeight;
	camera.updateProjectionMatrix();
	console.log('hit')
	renderer.setSize(canvas.clientWidth, canvas.clientHeight);
}
function render(time) {
  time*=.001
	gui.updateDisplay();
	orbitControl.target(new THREE.Vector3(0,900,0))
  orbit.rotation.z =time;
  orbit.rotation.y =time/2;
	renderer.render(scene, camera);
 
	requestAnimationFrame(render);
}
function initEvents() {
	document.addEventListener("keydown", eventHandler);
	window.addEventListener("resize", onWindowResize, false);
}

function eventHandler(e) {
	switch (e.key) {
		case "t":
			for (let i of objects) {
				i.material.wireframe = !i.material.wireframe;
			}
			break;
		case "d":
			if (devstorage.length === 0) {
				for (let i of objects) {
					console.log("hit");
					devstorage.push(Object.create(i.material));
					i.material = new THREE.MeshBasicMaterial({
						side: THREE.DoubleSide,
						color: new THREE.Color(
							`rgb(100,${Math.floor(Math.random() * 255)}, 20)`
						),
					});
				}
			} else
				for (let i of objects) {
					i.material = devstorage.shift();
				}
			break;
		default:
			break;
	}
}
