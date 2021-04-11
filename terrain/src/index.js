import * as THREE from "three";
import dat, { GUI } from "dat.gui";
import Stats from "stats-js";
import { TrackballControls } from "../node_modules/three/examples/jsm/controls/TrackballControls";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls";
import terrainfrag from "./terrainfrag.glsl";
import terrainvert from "./terrainvert.glsl";
import skyfrag from  "./skyfrag.glsl"
import skyvert from "./skyvert.glsl"
let camera,
	scene,
	renderer,
  canvas,
	stats,
	dLight,
	hLight,
	pLight,
	objects = [],
	terrain,
  gui,
  sky;
let control;
init();

animate()
function init() {
	renderer = new THREE.WebGLRenderer({ antialias: true,alpha: false});
	renderer.shadowMap.enabled = true;
	renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio( window.devicePixelRatio );
	renderer.domElement.id = "terrain";
  
	document.body.append(renderer.domElement);
  
	stats = new Stats();
	document.body.appendChild(stats.dom);

	scene = new THREE.Scene();
	scene.background = new THREE.Color().setHSL(0.0, 0, 0.0);
	scene.fog = new THREE.Fog(scene.background, 1, 5000);

	camera = new THREE.PerspectiveCamera(50, 1, 1, 6000);
	camera.position.set(0, 2, 10);
	scene.add(camera);
 
  control = new OrbitControls(camera,renderer.domElement)
  camera.updateMatrixWorld()
  
  //directional light
	dLight = new THREE.DirectionalLight("yellow", 1);
	dLight.color.setHSL(0.1, 1, 0.95);
	dLight.position.set(-1, 1.75, 0);
	dLight.position.multiplyScalar(30);
	dLight.castShadow = true;
	dLight.shadow.mapSize.width = 2048;
	dLight.shadow.mapSize.height = 2048;
	const d = 50;
	dLight.shadow.camera.left = -d;
	dLight.shadow.camera.right = d;
	dLight.shadow.camera.top = d;
	dLight.shadow.camera.bottom = -d;
	dLight.shadow.camera.far =Math.sqrt(Math.pow(dLight.position.x,2)+Math.pow(dLight.position.y,2)*500) ;
	dLight.shadow.bias = -.01;
 
	let dLightHelper = new THREE.DirectionalLightHelper(dLight, 10);
  let shadowHelper = new THREE.CameraHelper(dLight.shadow.camera);
  
  scene.add(shadowHelper)
	scene.add(dLight);
	scene.add(dLightHelper);
  gui = new GUI();
  gui.add(dLight.position,'x')
  
	//hemisphere light
  hLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0);
	hLight.color.setHSL(0.6, 1, 0.6);
	hLight.groundColor.setHSL(0.095, 1, 0.75);
	hLight.position.set(0, 0, 0);
	scene.add(hLight);
  scene.add(new THREE.AxesHelper(10))
  
	//terrain panel
	const tGeo = new THREE.PlaneGeometry(100, 100,1000,1000);
	const tMat = new THREE.MeshStandardMaterial({ 
  color: 0xffffff,
  displacementMap:createHeightMap() ,
  displacementScale:50,
  displacementBias: -10,

});


	tMat.color.setHSL(0.095, 1, 0.75);
  
  terrain = new THREE.Mesh(tGeo, tMat);
	terrain.position.y = 0;
	terrain.rotation.x = -Math.PI / 2;
	terrain.receiveShadow = true;
  terrain.updateMatrixWorld()
  terrain.castShadow = true;

  terrain.updateMatrix()
  terrain.geometry.computeVertexNormals()
	scene.add(terrain);

  //THREEsky
  sky = THREEskydome()
  
  sky.rotation.y = Math.PI
  scene.add(sky)
	console.log("ok");
 
  window.addEventListener( 'resize', onWindowResize );
  //testcube
 
  testCube()
  onWindowResize()
}

function animate() {
  requestAnimationFrame(animate);
  stats.begin();
	render();
  stats.end();
  
}

function render() {

	renderer.render(scene, camera);

}
function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
  
}
function THREEskydome() {
	


	const skyGeo = new THREE.SphereGeometry(4000, 32, 15);
	const skyMat = new THREE.MeshStandardMaterial({
		transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,

	});
  
	let tsky = new THREE.Mesh(skyGeo, skyMat);
  
	return tsky;
}
function testCube() {
	let cubeg = new THREE.BoxGeometry(0.5, 0.5, 0.5, 5, 5, 5);
	cubeg.computeVertexNormals();
	let cubem = new THREE.MeshPhongMaterial({
		color: 0xa1dffb,
	});
	let cube = new THREE.Mesh(cubeg, cubem);
	cube.position.set(0, .5, 0);
	cube.castShadow = true;
 
	cube.receiveShadow = true;
	scene.add(cube);
}
function createHeightMap() {
	const rtWidth = 512;
	const rtHeight = 512;
	const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight);
	const rtcamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
	const rtgeo = new THREE.PlaneGeometry(2, 2);

	const rtmat = new THREE.ShaderMaterial({

		vertexShader: terrainvert,
		fragmentShader: terrainfrag,
	});

	const rtplane = new THREE.Mesh(rtgeo, rtmat);
	const rtscene = new THREE.Scene();

	
	rtscene.add(rtcamera, rtplane);
	renderer.setRenderTarget(renderTarget);
	renderer.render(rtscene, rtcamera);
	renderer.setRenderTarget(null);


	return renderTarget.texture;
}