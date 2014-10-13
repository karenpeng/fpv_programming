if (!Detector.webgl) Detector.addGetWebGLMessage();

var container, stats;

var camera, controls, scene, renderer;

var cross;

var giantBox;

init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  //camera.position.z = 500;
  camera.position.z = 1000;

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

  // world

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xcccccc, 0.0002);

  var geometry = new THREE.PlaneGeometry(2000, 2000);
  geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
  });
  var plane = new THREE.Mesh(geometry, material);
  plane.position.y = -20;
  scene.add(plane);

  //var plane2 = plane.clone();
  //var plane2 = new THREE.Mesh(geometry, new THREE.)
  //plane2.rotation.x = Math.PI / 2;
  //plane2.position.z = -100;
  //scene.add(plane2);

  geometry = new THREE.BoxGeometry(200, 2000, 100);
  geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
  for (var i = 0, l = geometry.faces.length; i < l; i++) {

    var face = geometry.faces[i];
    face.vertexColors = new THREE.Color("rgb(" + i * 10 + "," + i * 10 + "," + i + ")");
  }
  material = new THREE.MeshPhongMaterial({
    vertexColors: THREE.VertexColors,
    //color: 0xff0000,
    side: THREE.DoubleSide
  });
  giantBox = new THREE.Mesh(geometry, material);
  //giantBox.position.y = 1000;
  //scene.add(giantBox);

  // lights

  light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1, 1, 1);
  scene.add(light);

  light = new THREE.DirectionalLight(0x002288);
  light.position.set(-1, -1, -1);
  scene.add(light);

  light = new THREE.AmbientLight(0x222222);
  scene.add(light);

  var sphere = new THREE.SphereGeometry(0.2, 16, 8);

  var intensity = 2.5;
  var distance = 50;
  var c1 = 0xff0040,
    c2 = 0x0040ff,
    c3 = 0x80ff80,
    c4 = 0xffaa00,
    c5 = 0x00ffaa,
    c6 = 0xff1100;

  light1 = new THREE.PointLight(c1, intensity, distance);
  light1.add(new THREE.Mesh(sphere, new THREE.MeshPhongMaterial({
    color: c1
  })));
  light1.position.y = Math.random() * 10;
  scene.add(light1);

  light2 = new THREE.PointLight(c2, intensity, distance);
  light2.add(new THREE.Mesh(sphere, new THREE.MeshPhongMaterial({
    color: c2
  })));
  light2.position.y = Math.random() * 10;
  scene.add(light2);

  light3 = new THREE.PointLight(c3, intensity, distance);
  light3.add(new THREE.Mesh(sphere, new THREE.MeshPhongMaterial({
    color: c3
  })));
  light3.position.y = Math.random() * 10;
  scene.add(light3);

  light4 = new THREE.PointLight(c4, intensity, distance);
  light4.add(new THREE.Mesh(sphere, new THREE.MeshPhongMaterial({
    color: c4
  })));
  light4.position.y = Math.random() * 10;
  scene.add(light4);

  light5 = new THREE.PointLight(c5, intensity, distance);
  light5.add(new THREE.Mesh(sphere, new THREE.MeshPhongMaterial({
    color: c5
  })));
  light5.position.y = Math.random() * 10;
  scene.add(light5);

  light6 = new THREE.PointLight(c6, intensity, distance);
  light6.add(new THREE.Mesh(sphere, new THREE.MeshPhongMaterial({
    color: c6
  })));
  scene.add(light6);

  // renderer

  renderer = new THREE.WebGLRenderer({
    antialias: false
  });
  renderer.setClearColor(scene.fog.color, 1);
  renderer.setSize(window.innerWidth, window.innerHeight);

  container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  stats.domElement.style.zIndex = 100;
  container.appendChild(stats.domElement);

  //

  window.addEventListener('resize', onWindowResize, false);

  //

  render();

}

window.onkeydown = function () {
  console.log(camera.position);
};

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  controls.handleResize();

  render();

}

function animate() {

  requestAnimationFrame(animate);

  var time = Date.now() * 0.00025;

  camera.position.z--;
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

  controls.update();

  render();

}

function render() {

  renderer.render(scene, camera);
  stats.update();

}