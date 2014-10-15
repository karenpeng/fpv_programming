if (!Detector.webgl) Detector.addGetWebGLMessage();
var container, controls;
var camera, scene, light, renderer;
var geometry, material, object, mesh;
var mouseX = 0,
		mouseY = 0;
var clock = new THREE.Clock();
var guy;
var cube;

init();
animate();

function init() {
		container = document.createElement('div');
		document.body.appendChild(container);
		camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 15000);
		camera.position.z = 500;
		camera.position.y = 100;
		camera.target = new THREE.Vector3(0, -10, 0);

		controls = new THREE.TrackballControls(camera);

		controls.rotateSpeed = 1.0;
		controls.zoomSpeed = 1.2;
		controls.panSpeed = 0.8;

		controls.noZoom = false;
		controls.noPan = false;

		controls.staticMoving = true;
		controls.dynamicDampingFactor = 0.3;

		controls.keys = [65, 83, 68];

		controls.addEventListener('change', render);

		scene = new THREE.Scene();
		scene.fog = new THREE.Fog(0xaaaaaa, 1, 1500);

		light = new THREE.PointLight(0xff2200);
		light.position.set(100, 100, 100);
		scene.add(light);

		light = new THREE.PointLight(0x0022ff);
		light.position.set(-100, -100, 100);
		scene.add(light);

		var dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
		dirLight.color.setHSL(0.1, 1, 0.95);
		dirLight.position.set(-1, 1.75, 1);
		dirLight.position.multiplyScalar(50);
		scene.add(dirLight);
		dirLight.castShadow = true;

		dirLight.shadowMapWidth = 2048;
		dirLight.shadowMapHeight = 2048;

		var d = 50;

		dirLight.shadowCameraLeft = -d;
		dirLight.shadowCameraRight = d;
		dirLight.shadowCameraTop = d;
		dirLight.shadowCameraBottom = -d;

		dirLight.shadowCameraFar = 3500;
		dirLight.shadowBias = -0.0001;
		dirLight.shadowDarkness = 0.35;
		//dirLight.shadowCameraVisible =

		light = new THREE.AmbientLight(0xaaaaaa);
		scene.add(light);

		geometry = new THREE.PlaneGeometry(1000, 2000);
		//geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
		//geometry.rotation.x = -Math.PI / 2;
		material = new THREE.MeshLambertMaterial({
				color: 0xaaffaa
		});
		var ground = new THREE.Mesh(geometry, material);
		ground.rotation.x = -Math.PI / 2;
		ground.position.y = -22;
		ground.receiveShadow = true;
		scene.add(ground);

		geometry = new THREE.BoxGeometry(10, 10, 10);
		material = new THREE.MeshLambertMaterial({
				color: 0xffffff,
				morphTargets: true
		});
		// construct 8 blend shapes

		for (var i = 0; i < geometry.vertices.length; i++) {
				var vertices = [];
				for (var v = 0; v < geometry.vertices.length; v++) {
						vertices.push(geometry.vertices[v].clone());
						if (v === i) {
								vertices[vertices.length - 1].x *= 2;
								vertices[vertices.length - 1].y *= 2;
								vertices[vertices.length - 1].z *= 2;
						}
				}
				geometry.morphTargets.push({
						name: "target" + i,
						vertices: vertices
				});
		}

		mesh = new THREE.Mesh(geometry, material);
		mesh.castShadow = true;
		mesh.position.y = -20;

		scene.add(mesh);

		var loader = new THREE.JSONLoader();
		loader.load("model/guy.js", function (geometry1) {
				material = new THREE.MeshPhongMaterial({
						color: 0xaaaaaa
				});
				guy = new THREE.Mesh(geometry1, material);
				guy.scale.set(2, 2, 2);
				guy.position.y = -12;
				guy.position.z = 40;
				guy.castShadow = true;
				//console.log(guy);
				scene.add(guy);
		});

		geometry = new THREE.BoxGeometry(10, 10, 10);
		geometry.vertucesNeedUpdate = true;
		material = new THREE.MeshPhongMaterial({
				color: 0xffaaaa
		});
		cube = new THREE.Mesh(geometry, material);
		cube.position.y = -10;
		cube.position.x = -20;
		cube.castShadow = true;

		scene.add(cube);

		//clock.start();
		//

		renderer = new THREE.WebGLRenderer({
				antialias: true
		});
		renderer.setClearColor(0x222222, 1);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.sortObjects = false;
		container.appendChild(renderer.domElement);
		renderer.gammaInput = true;
		renderer.gammaOutput = true;

		renderer.shadowMapEnabled = true;
		renderer.shadowMapCullFace = THREE.CullFaceBack;

		//

		window.addEventListener('resize', onWindowResize, false);
}

function onDocumentMouseMove(event) {

		mouseX = (event.clientX - windowHalfX);
		mouseY = (event.clientY - windowHalfY) * 2;

}

function onWindowResize() {

		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {
		requestAnimationFrame(animate);
		render();
		controls.update();
}

var theta = 0;

function render() {
		//theta++;
		theta += 0.1;
		//mesh.rotation.y += 0.01;

		//mesh.morphTargetInfluences[ 0 ] = Math.sin( mesh.rotation.y ) * 0.5 + 0.5;

		//camera.position.x += ( mouseX - camera.position.x ) * .005;
		//camera.position.y += (-mouseY - camera.position.y) * .01;
		geometry.verticesNeedUpdate = true;
		mesh.morphTargetInfluences[0] = (Math.sin(theta) + 1);
		// geometry.vertices[0].x += Math.cos(theta);
		geometry.vertices[0].x = Math.floor((Math.cos(theta) + 1) * 5);

		//console.log(clock.elapsedTime);
		console.log(geometry.vertices[0].x)

		camera.lookAt(scene.position);

		renderer.render(scene, camera);
}