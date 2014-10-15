if (!Detector.webgl) Detector.addGetWebGLMessage();
var container;
var camera, scene, light, renderer;
var geometry, material, object, mesh;
var mouseX = 0,
		mouseY = 0;
var clock = new THREE.Clock();

init();
animate();

function init() {
		container = document.createElement('div');
		document.body.appendChild(container);
		camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 15000);
		camera.position.z = 500;

		scene = new THREE.Scene();
		scene.fog = new THREE.Fog(0x000000, 1, 15000);

		light = new THREE.PointLight(0xff2200);
		light.position.set(100, 100, 100);
		scene.add(light);

		light = new THREE.AmbientLight(0x111111);
		scene.add(light);

		geometry = new THREE.BoxGeometry(100, 100, 100);
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

		scene.add(mesh);

		clock.start();
		//

		renderer = new THREE.WebGLRenderer();
		renderer.setClearColor(0x222222, 1);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.sortObjects = false;
		container.appendChild(renderer.domElement);

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
}
var theta = 0;

function render() {
		theta += 0.01;
		mesh.rotation.y += 0.01;

		//mesh.morphTargetInfluences[ 0 ] = Math.sin( mesh.rotation.y ) * 0.5 + 0.5;

		//camera.position.x += ( mouseX - camera.position.x ) * .005;
		camera.position.y += (-mouseY - camera.position.y) * .01;
		mesh.morphTargetInfluences[0] = Math.sin(theta) * 4;
		console.log(clock.elapsedTime);

		camera.lookAt(scene.position);

		renderer.render(scene, camera);
}