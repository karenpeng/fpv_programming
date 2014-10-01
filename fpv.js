var camera, scene, renderer;
var geometry, material, mesh, loader;
var controls;

var objects = [];

var raycaster;

var blocker = document.getElementById('blocker');
var instructions = document.getElementById('instructions');

// http://www.html5rocks.com/en/tutorials/pointerlock/intro/

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if (havePointerLock) {

  var element = document.body;

  var pointerlockchange = function (event) {

    if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {

      controls.enabled = true;

      blocker.style.display = 'none';

    } else {

      controls.enabled = false;

      blocker.style.display = '-webkit-box';
      blocker.style.display = '-moz-box';
      blocker.style.display = 'box';

      instructions.style.display = '';
    }

  };

  var pointerlockerror = function (event) {

    instructions.style.display = '';

  };

  // Hook pointer lock state change events
  document.addEventListener('pointerlockchange', pointerlockchange, false);
  document.addEventListener('mozpointerlockchange', pointerlockchange, false);
  document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

  document.addEventListener('pointerlockerror', pointerlockerror, false);
  document.addEventListener('mozpointerlockerror', pointerlockerror, false);
  document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

  instructions.addEventListener('click', function (event) {

    instructions.style.display = 'none';

    // Ask the browser to lock the pointer
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

    if (/Firefox/i.test(navigator.userAgent)) {

      var fullscreenchange = function (event) {

        if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {

          document.removeEventListener('fullscreenchange', fullscreenchange);
          document.removeEventListener('mozfullscreenchange', fullscreenchange);

          element.requestPointerLock();
        }

      };

      document.addEventListener('fullscreenchange', fullscreenchange, false);
      document.addEventListener('mozfullscreenchange', fullscreenchange, false);

      element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

      element.requestFullscreen();

    } else {

      element.requestPointerLock();

    }

  }, false);

} else {

  instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

}

init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 10, 300);
  camera.position.set(0, 0, 150);
  camera.lookAt(new THREE.Vector3());

  //scene
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xffffff, 0, 350);

  // floor
  material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    ambient: 0xffffff
  });
  mesh = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000, 2, 2), material);
  mesh.position.y = -5;
  mesh.rotation.x = -Math.PI / 2;
  scene.add(mesh);

  //lights

  scene.add(new THREE.AmbientLight(0x111111));

  var intensity = 2.5;
  var distance = 100;
  var c1 = 0xff0040,
    c2 = 0x0040ff,
    c3 = 0x80ff80,
    c4 = 0xffaa00,
    c5 = 0x00ffaa,
    c6 = 0xff1100;
  //var c1 = 0xffffff, c2 = 0xffffff, c3 = 0xffffff, c4 = 0xffffff, c5 = 0xffffff, c6 = 0xffffff;

  var sphere = new THREE.SphereGeometry(0.25, 16, 8);

  light1 = new THREE.PointLight(c1, intensity, distance);
  light1.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
    color: c1
  })));
  light1.position.y = Math.random() * 10;
  scene.add(light1);

  light2 = new THREE.PointLight(c2, intensity, distance);
  light2.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
    color: c2
  })));
  light2.position.y = Math.random() * 10;
  scene.add(light2);

  light3 = new THREE.PointLight(c3, intensity, distance);
  light3.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
    color: c3
  })));
  light3.position.y = Math.random() * 10;
  scene.add(light3);

  light4 = new THREE.PointLight(c4, intensity, distance);
  light4.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
    color: c4
  })));
  light4.position.y = Math.random() * 10;
  scene.add(light4);

  light5 = new THREE.PointLight(c5, intensity, distance);
  light5.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
    color: c5
  })));
  light5.position.y = Math.random() * 10;
  scene.add(light5);

  light6 = new THREE.PointLight(c6, intensity, distance);
  light6.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
    color: c6
  })));
  scene.add(light6);

  var dlight = new THREE.DirectionalLight(0xffffff, 0.1);
  dlight.position.set(0.5, -1, 0).normalize();
  scene.add(dlight);

  controls = new THREE.PointerLockControls(camera);
  scene.add(controls.getObject());

  raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);

  // objects

  geometry = new THREE.BoxGeometry(10, 10, 10);

  for (var i = 0; i < 20; i++) {

    //material = new THREE.MeshDepthMaterial({
    material = new THREE.MeshPhongMaterial({
      //material = new THREE.MeshBasicMaterial({
      //material = new THREE.MeshNormalMaterial({
      //material = new THREE.MeshLamberMaterial({
      specular: 0xffffff,
      shading: THREE.FlatShading,
      vertexColors: THREE.VertexColors
    });

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = Math.floor(Math.random() * 10 - 10) * 10;
    mesh.position.z = Math.floor(Math.random() * 10 - 10) * 20;
    mesh.position.y = Math.floor(Math.random() * 10) * 6;
    scene.add(mesh);
    objects.push(mesh);

  }

  //mr.lonely
  //TODO:why it's not loading?
  material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    ambient: 0xffffff
  });
  var loader = new THREE.JSONLoader();
  loader.load("/model/test_polygon.js", createCharacter);
  var mr;
  /*
  mr.vertices.push(
    new THREE.Vector3(0, 24, 20),
    new THREE.Vector3(20, 24, 20),
    new THREE.Vector3(20, 24, 0),
    new THREE.Vector3(0, 24, 0),
    new THREE.Vector3(14, 0, 10),
    new THREE.Vector3(6, 0, 10)
  );
  mr.faces.push(
    new THREE.Face3(2, 1, 0),
    new THREE.Face3(3, 2, 0),

    new THREE.Face3(4, 2, 3),
    new THREE.Face3(5, 4, 3),

    new THREE.Face3(5, 0, 3),

    new THREE.Face3(0, 4, 5),
    new THREE.Face3(1, 4, 0),

    new THREE.Face3(4, 1, 2)
    // new THREE.Face4(0, 1, 2, 3),
    // new THREE.Face4(2, 3, 4, 5),
    // new THREE.Face3(1, 2, 4),
    // new THREE.Face4(0, 1, 4, 5),
    // new THREE.Face3(0, 3, 5)
  );
*/
  //mr.computeBoundingSphere();

  // var mesh = new THREE.Mesh(mr, mrMaterial);
  // mesh.position.y = 20;
  // console.log(mesh.position);
  // scene.add(mesh);

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xffffff);
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  //

  window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function createCharacter(geometry) {
  var materials = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    ambient: 0xffffff
  });
  //console.log(geometry);
  mr = new THREE.Mesh(geometry, materials);
  //mesh.position.y = 20;
  console.log(mr.geometry.vertices)
  scene.add(mr);
}

function animate() {

  requestAnimationFrame(animate);

  controls.isOnObject(false);

  // raycaster.ray.origin.copy(controls.getObject().position);
  // raycaster.ray.origin.y -= 100;

  // var intersections = raycaster.intersectObjects(objects);

  // if (intersections.length > 0) {

  //   controls.isOnObject(true);

  // }

  //update lights
  var time = Date.now() * 0.00025;
  var z = 20,
    d = 100;

  light1.position.x = Math.sin(time * 0.7) * d;
  light1.position.z = Math.cos(time * 0.3) * d;

  light2.position.x = Math.cos(time * 0.3) * d;
  light2.position.z = Math.sin(time * 0.7) * d;

  light3.position.x = Math.sin(time * 0.7) * d;
  light3.position.z = Math.sin(time * 0.5) * d;

  light4.position.x = Math.sin(time * 0.3) * d;
  light4.position.z = Math.sin(time * 0.5) * d;

  light5.position.x = Math.cos(time * 0.3) * d;
  light5.position.z = Math.sin(time * 0.5) * d;

  light6.position.x = Math.cos(time * 0.7) * d;
  light6.position.z = Math.cos(time * 0.5) * d;

  //animate character
  //console.log(mr)
  if (mr !== undefined) {
    mr.geometry.vertices[0].y = Math.cos(time * 0.5) * d;
  }

  controls.update();

  renderer.render(scene, camera);

}