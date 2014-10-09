var camera, scene, renderer;
var geometry, material, mesh, loader;
var controls;
var mr;
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var cameraOrtho, sceneRenderTarget;

var objects = [];

var raycaster;

var stackCylinders = [];
var queCylinders = [];

var stackCylinder, queCylinder;

var theta = 0;
var test;

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
  //lences is not that successful
  // sceneRenderTarget = new THREE.Scene();

  // cameraOrtho = new THREE.OrthographicCamera(SCREEN_WIDTH / -2, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, SCREEN_HEIGHT / -2, -10000, 10000);
  // cameraOrtho.position.z = 100;

  // sceneRenderTarget.add(cameraOrtho);

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
  geometry = new THREE.PlaneGeometry(1000, 1000, 2, 2);
  geometry.computeTangents();
  mesh = new THREE.Mesh(geometry, material);

  mesh.position.y = -5;
  mesh.rotation.x = -Math.PI / 2;
  scene.add(mesh);

  //lights

  scene.add(new THREE.AmbientLight(0x111111));

  addShadowedLight(1, 1, 1, 0xffffff, 0.35);
  addShadowedLight(0.5, 1, -1, 0x94d4d4, 0.35);

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
  //scene.add(light1);

  light2 = new THREE.PointLight(c2, intensity, distance);
  light2.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
    color: c2
  })));
  light2.position.y = Math.random() * 10;
  //scene.add(light2);

  light3 = new THREE.PointLight(c3, intensity, distance);
  light3.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
    color: c3
  })));
  light3.position.y = Math.random() * 10;
  //scene.add(light3);

  light4 = new THREE.PointLight(c4, intensity, distance);
  light4.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
    color: c4
  })));
  light4.position.y = Math.random() * 10;
  //scene.add(light4);

  light5 = new THREE.PointLight(c5, intensity, distance);
  light5.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
    color: c5
  })));
  light5.position.y = Math.random() * 10;
  //scene.add(light5);

  light6 = new THREE.PointLight(c6, intensity, distance);
  light6.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
    color: c6
  })));
  //scene.add(light6);

  var dlight = new THREE.DirectionalLight(0xffffff, 0.1);
  dlight.position.set(0.5, -1, 0).normalize();
  scene.add(dlight);

  controls = new THREE.PointerLockControls(camera);
  scene.add(controls.getObject());

  raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);

  // objects
  //mr.lonely
  material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    ambient: 0xffffff
  });
  var loader = new THREE.JSONLoader();
  //var mr;
  loader.load("model/test_polygon.js", createCharacter);

  geometry = new THREE.BoxGeometry(10, 10, 10);

  for (var i = 0; i < 20; i++) {
    var ka = 0.4;
    //material = new THREE.MeshDepthMaterial({
    //material = new THREE.MeshPhongMaterial({
    //material = new THREE.MeshBasicMaterial({
    //material = new THREE.MeshNormalMaterial({
    material = new THREE.MeshLambertMaterial({
      //specular: 0xffffff,
      color: 0x80FC66,
      shading: THREE.FlatShading
      //vertexColors: THREE.VertexColors

    });
    material.ambient.setRGB(material.color.r * ka, material.color.g * ka, material.color.b * ka)

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = Math.floor(Math.random() * 10 - 10) * 10;
    mesh.position.z = Math.floor(Math.random() * 10 - 10) * 20;
    mesh.position.y = Math.floor(Math.random() * 10) * 6;
    scene.add(mesh);
    objects.push(mesh);

  }

  //for stack
  geometry = new THREE.CylinderGeometry(10, 10, 6, 32);
  material = new THREE.MeshPhongMaterial({
    color: 0xffffff
  });
  for (i = 0; i < 6; i++) {
    stackCylinder = new THREE.Mesh(geometry, material);
    stackCylinder.position.x = 60;
    stackCylinder.position.z = 60;
    stackCylinder.position.y = i * 8 - 3;
    if (i === 5) {
      stackCylinder.position.y = 100;
    }
    stackCylinder.whatever = Math.random();
    stackCylinders.push(stackCylinder);
    scene.add(stackCylinder);
  }

  for (i = 0; i < 6; i++) {
    queCylinder = new THREE.Mesh(geometry, material);
    queCylinder.position.x = 100;
    queCylinder.position.z = 60;
    queCylinder.position.y = 5;
    queCylinder.rotation.x = Math.PI / 2;
    queCylinder.position.z = i * 8 - 16;
    if (i === 5) {
      queCylinder.position.z = -100;
    }
    queCylinder.whatever = Math.random();
    queCylinders.push(queCylinder);
    scene.add(queCylinder);
  }

  //mr.computeBoundingSphere();
  geometry = new THREE.SphereGeometry(5, 30, 30);
  geometry.dynamic = true;
  test = new THREE.MeshPhongMaterial(geometry, material);
  scene.add(test);

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

function addShadowedLight(x, y, z, color, intensity) {

  var directionalLight = new THREE.DirectionalLight(color, intensity);
  directionalLight.position.set(x, y, z);
  scene.add(directionalLight);

  directionalLight.castShadow = true;
  // directionalLight.shadowCameraVisible = true;

  var d = 1;
  directionalLight.shadowCameraLeft = -d;
  directionalLight.shadowCameraRight = d;
  directionalLight.shadowCameraTop = d;
  directionalLight.shadowCameraBottom = -d;

  directionalLight.shadowCameraNear = 1;
  directionalLight.shadowCameraFar = 4;

  directionalLight.shadowMapWidth = 1024;
  directionalLight.shadowMapHeight = 1024;

  directionalLight.shadowBias = -0.005;
  directionalLight.shadowDarkness = 0.15;

}

function createCharacter(geometry) {
  var materials = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    ambient: 0xffffff
  });
  //console.log(geometry);
  geometry.attributes.position.needsUpdate = true;
  geometry.dynamic = true;
  mr = new THREE.Mesh(geometry, materials);
  //mesh.position.y = 20;
  console.log(mr.geometry.vertices);
  scene.add(mr);
}

var startTime;
var count = 0;

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
  if (count === 0) {
    startTime = time;
    count++;
  }

  var z = 20,
    d = 100;

  // light1.position.x = Math.sin(time * 0.7) * d;
  // light1.position.z = Math.cos(time * 0.3) * d;

  // light2.position.x = Math.cos(time * 0.3) * d;
  // light2.position.z = Math.sin(time * 0.7) * d;

  // light3.position.x = Math.sin(time * 0.7) * d;
  // light3.position.z = Math.sin(time * 0.5) * d;

  // light4.position.x = Math.sin(time * 0.3) * d;
  // light4.position.z = Math.sin(time * 0.5) * d;

  // light5.position.x = Math.cos(time * 0.3) * d;
  // light5.position.z = Math.sin(time * 0.5) * d;

  // light6.position.x = Math.cos(time * 0.7) * d;
  // light6.position.z = Math.cos(time * 0.5) * d;

  //animate character
  //console.log(mr)
  if (mr !== undefined) {
    //mr.geometry.vertices[0].y = Math.cos(time * 0.5) * d;
    mr.position.y = Math.cos(time * 4) * d / 4 + d / 4;
    //geometry.vertices[0].y = Math.cos(time * 4) * d / 8 + 20;
    //console.log(geometry.vertices[0])
    //mr.geometry.verticesNeedUpdate = true;
  }

  // var i = 0;
  // stackCylinders.forEach(function (c) {
  //   //noise.seed(Math.random());
  //   c.position.y = noise.simplex2(c.whatever, time) + 10 * i;
  //   c.whatever += 0.001;
  //   i++;
  // });
  /* so weird to use noise
  var i = 0;
  stackCylinders.forEach(function (c) {
    //noise.seed(Math.random());
    c.position.y = noise.simplex2(c.whatever, time) + 10 * i;
    c.whatever += 0.001;
    i++;
  });

  var j = 0;
  queCylinders.forEach(function (c) {
    //noise.seed(Math.random());
    c.position.x = noise.simplex2(c.whatever, time) + 10 * j + 30;
    c.whatever += 0.001;
    i++;
  });
  //queCylinder.position.x = noise.simplex2(time, time);
*/

  //TODO: why the hell test does not show up?
  geometry.vertices[0].y = Math.cos(time * 4) * d / 10 + d / 10;
  //test.geometry.verticesNeedUpdate = true;
  //console.log(camera.position);
  //console.log(time)
  if (time - startTime > 1 && time - startTime <= 2) {
    if (stackCylinders[5].position.y > 5 * 8 - 3) {
      //console.log("ooh")
      stackCylinders[5].position.y--;
    }
    if (queCylinders[5].position.z < 5 * 8 - 16) {
      //console.log("ooh")
      queCylinders[5].position.z++;
    }
  }

  if (time - startTime > 2) {
    stackCylinders[5].position.y++;
    //console.log(stackCylinders[5].position.y)
    queCylinders[0].position.z++;
  }

  controls.update();

  renderer.render(scene, camera);
  //just want to take a break...

}