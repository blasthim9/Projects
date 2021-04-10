import * as THREE from "three";
import dat from "dat.gui";
import Stats from "stats-js";
import { TrackballControls } from "../node_modules/three/examples/jsm/controls/TrackballControls";
import terrainfrag from "./terrainfrag.glsl";
import terrainvert from "./terrainvert.glsl";
import { FogExp2, HemisphereLight, LineSegments, WireframeGeometry } from "three";

var stats, scene, renderer, composer,canvas;
var camera, cameraControls,dlight,orbit;
let segs = [];
var Variables = function () {
	this.speed = 1.0;
};
var variables = new Variables();
let loader = new THREE.TextureLoader();
var gui = new dat.GUI();
gui.add(variables, "speed", 0, 2);
gui.closed = true;
if (!init()) animate();

// init the scene
function init() {
	renderer = new THREE.WebGLRenderer({
		antialias: true, // to get smoother output
	});
	
	renderer.setClearColor(0xbbbbbb);
	renderer.domElement.setAttribute("id","terrain")
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	document.body.appendChild(renderer.domElement);
	canvas = document.querySelector('#terrain')
	renderer.physicallyCorrectLights = true;
	// add Stats.js - https://github.com/mrdoob/stats.js
	stats = new Stats();
	stats.domElement.style.position = "absolute";
	stats.domElement.style.bottom = "0px";
	document.body.appendChild(stats.domElement);

	// create a scene
	scene = new THREE.Scene();
	
	// put a camera in the scene
	camera = new THREE.PerspectiveCamera(
		35,
		window.innerWidth / window.innerHeight,
		1,
		8000
	);

	initEventListeners()
	camera.position.set(40,5, 40);
	gui.add(camera.position,'x').name('camposition')
	segs.push(createTerrainSegment(false));
	//scene.fog=fog
	
	
	// create a camera contol
	cameraControls = new TrackballControls(camera, renderer.domElement);
	//dlight	
	dlight = new THREE.SpotLight('yellow',2000000)
	dlight.castShadow = true;
	dlight.position.set(-900,8,0)
	
	dlight.decay=2.1;
	dlight.shadow.mapSize.width = 2; // default
	dlight.shadow.mapSize.height = 2; // default
	dlight.shadow.focus = 100;
	dlight.shadow.camera.near = 900; // default
	dlight.shadow.camera.far = 1000; // default
	dlight.angle =  Math.PI/50;
	const shelper = new THREE.CameraHelper( dlight.shadow.camera );
	scene.add( shelper );
	gui.add(dlight.shadow.camera,'near')
	gui.add(dlight.shadow.camera,'far')
	gui.add(dlight.position,'x').min(-1000).max(1000).step(.2)
	gui.add(dlight.position,'y').min(-1000).max(1000).step(.2)
	
	let dhelper = new THREE.SpotLightHelper(dlight,5)
	
	//hlight
	let hmlight =new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 0.1 );
	let hhelper = new THREE.HemisphereLightHelper(hmlight,5) 
	//orbit
	orbit = new THREE.Mesh(new THREE.SphereGeometry(1,2,2),new THREE.MeshBasicMaterial({visible:false}))
	orbit.position.set(0,0,0)
	orbit.rotation.z = Math.PI*1.1
	orbit.add(dlight)
	scene.add(orbit)
	gui.add(orbit.rotation,'z').min(0).max(Math.PI*2).step(Math.PI/100)
	// Objects
	let atmog = new THREE.SphereGeometry(500, 32, 32)
	let atmom = new THREE.MeshPhysicalMaterial({
		transparent : true,
		emissive: 'skyblue',
		opacity: .1,
		side: THREE.DoubleSide,
	
	})
	let atmo = new THREE.Mesh(atmog,atmom)
	atmo.castShadow = true;
	//atmo.add(hmlight,hhelper)
	const alight = new THREE.AmbientLight( 0x000000,1 )
	scene.add(dhelper,alight,camera, ...segs,...createHelper());
	
	
}
function testCube(){
	let cubeg = new THREE.BoxGeometry(.5,.5,.5,5,5,5)
	cubeg.computeVertexNormals()
	let cubem = new THREE.MeshPhongMaterial({
		color: 0xa1dffb
	})
	let cube = new THREE.Mesh(cubeg,cubem)
	cube.position.set(0,1,0)
	cube.castShadow = true;
	cube.receiveShadow = true;
	scene.add(cube)
}
function createHelper() {
	let axes = new THREE.AxesHelper(500);
	let grid = new THREE.GridHelper(2, 5);
	return [grid, axes];
}
// animation loop
function animate() {
	requestAnimationFrame(animate);
	
	dlight.target.updateMatrixWorld();
	camera.updateProjectionMatrix()
	resizeRendererToDisplaySize(renderer)
	// do the render
	render();

	// update stats
	stats.update();
}

// render the scene
function render() {
	// variable which is increase by Math.PI every seconds - usefull for animation
	var PIseconds = Date.now() * Math.PI;

	// update camera controls
	cameraControls.update();

	// animation of all objects

	// actually render the scene
	renderer.render(scene, camera);
	
}

function createTerrainSegment(wire = false) {

	let segmat= new THREE.MeshPhysicalMaterial( {
		displacementMap: createHeightMap(),
		
		displacementScale: 20,
		
		//map: loader.load(dirt),
		wireframe: false,
		side: THREE.DoubleSide,
		
	 });
	 
	 gui.add(segmat, 'wireframe')
	
	let segGeo = new THREE.PlaneGeometry(50, 50,1000, 1000);

	let terrainSeg = new THREE.Mesh(segGeo, segmat);
	terrainSeg.castShadow = true;
	terrainSeg.receiveShadow = true;
	terrainSeg.geometry.computeVertexNormals()
	terrainSeg.rotation.x = THREE.Math.degToRad(-90);
	
	console.log()
	return terrainSeg;
}
function createHeightMap(obj=null) {
	const rtWidth = 512;
	const rtHeight = 512;
	const renderTarget = new THREE.WebGLRenderTarget(rtWidth,rtHeight)
	const rtcamera = new THREE.OrthographicCamera(
		-1,
		1,
		1,
		-1,
		-1,
		1
	)
	
	var uniforms = {
	
	};
	const rtgeo = new THREE.PlaneGeometry(2,2);

	const rtmat = new THREE.ShaderMaterial({
		uniforms: uniforms,
		vertexShader: terrainvert,
		fragmentShader: terrainfrag
	})
	
	const rtplane = new THREE.Mesh(rtgeo, rtmat);
	const rtscene = new THREE.Scene();
	
	rtscene.background = new THREE.Color('red');
	rtscene.add(rtcamera, rtplane);
	renderer.setRenderTarget(renderTarget);
	renderer.render(rtscene, rtcamera);
	renderer.setRenderTarget(null)
	console.log(renderTarget.texture)
	
	return renderTarget.texture;
}

function initEventListeners(){
	document.addEventListener('keydown',toggleMap,false)
}
function toggleMap(e){ 
	if(e.key == 'q'){
	
	for(let i of segs){
		i.material= new THREE.MeshPhysicalMaterial( {
			displacementMap: null,
			
			map: createHeightMap(),
			
			//map: loader.load(dirt),
			wireframe: false,
			side: THREE.DoubleSide,
			
		 });;
	}}
}
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}