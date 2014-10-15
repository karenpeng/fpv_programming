if (!Detector.webgl) Detector.addGetWebGLMessage();

var container, stats;

var camera, controls, scene, renderer;

var cross;

var giantBox;
var morphs = [];
var clock = new THREE.Clock();

var areaLight1;
var isUserInteracting = false,
  onMouseDownMouseX = 0,
  onMouseDownMouseY = 0,
  lon = 0,
  onMouseDownLon = 0,
  lat = 0,
  onMouseDownLat = 0,
  phi = 0,
  theta = 0;
var cube;
init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  //camera.position.z = 500;
  camera.target = new THREE.Vector3(0, 300, 0);
  camera.position.z = 50;

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

  // LIGHTS

  //addShadowedLight(1, 1, 1, 0xffffff, 1.35);
  //addShadowedLight(0.5, 1, -1, 0xffaa00, 1);

  var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  hemiLight.color.setHSL(0.6, 1, 0.6);
  hemiLight.groundColor.setHSL(0.095, 1, 0.75);
  hemiLight.position.set(0, 500, 0);
  scene.add(hemiLight);

  //

  var dirLight = new THREE.DirectionalLight(0xffffff, 1);
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
  //dirLight.shadowCameraVisible = true;
  // lights

  // light = new THREE.AmbientLight(0x222222);
  // scene.add(light);

  // addShadowedLight(1, 1, 1, 0xffffff, 1);
  // addShadowedLight(0.5, 1, -1, 0xffaa00, 0.75);

  // light = new THREE.DirectionalLight(0xffffff);
  // light.position.set(1, 1, 1);
  // scene.add(light);
  // // light.castShadow = true;
  // // light.shadowCameraNear = 1200;
  // // light.shadowCameraFar = 2500;
  // // light.shadowCameraFov = 50;

  // light = new THREE.DirectionalLight(0x002288);
  // light.position.set(-1, -1, -1);
  // scene.add(light);

  // var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  // hemiLight.color.setHSL(0.6, 1, 0.6);
  // hemiLight.groundColor.setHSL(0.095, 1, 0.75);
  // hemiLight.position.set(0, 500, 0);
  // scene.add(hemiLight);

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

  //light.shadowCameraVisible = true;

  light1.shadowBias = 0.0001;
  light1.shadowDarkness = 0.5;

  light1.shadowMapWidth = window.innerWidth;
  light1.shadowMapHeight = window.innerHeight;
  //scene.add(light1);

  light2 = new THREE.PointLight(c2, intensity, distance);
  light2.add(new THREE.Mesh(sphere, new THREE.MeshLambertMaterial({
    color: c2
  })));
  light2.position.y = Math.random() * 10;
  scene.add(light2);

  light3 = new THREE.PointLight(c3, intensity, distance);
  light3.add(new THREE.Mesh(sphere, new THREE.MeshLambertMaterial({
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
  light5.add(new THREE.Mesh(sphere, new THREE.MeshLambertMaterial({
    color: c5
  })));
  light5.position.y = Math.random() * 10;
  scene.add(light5);

  light6 = new THREE.PointLight(c6, intensity, distance);
  light6.add(new THREE.Mesh(sphere, new THREE.MeshLambertMaterial({
    color: c6
  })));
  scene.add(light6);

  areaLight1 = new THREE.AreaLight(0xff0000, 1);
  areaLight1.position.set(10.0001, 10.0001, 18.5001);
  areaLight1.rotation.set(-0.74719, 0.0001, 0.0001);
  areaLight1.width = 10;
  areaLight1.height = 1;
  scene.add(areaLight1);

  /*
  //
  //objects
  //
*/

  var geometry = new THREE.PlaneGeometry(2000, 2000);
  geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

  var material = new THREE.MeshPhongMaterial({
    // color: 0xccccff,
    // side: THREE.DoubleSide
    ambient: 0x999999,
    color: 0x999999,
    specular: 0x101010
  });
  var plane = new THREE.Mesh(geometry, material);
  plane.position.y = -20;

  scene.add(plane);
  plane.receiveShadow = true;

  //var plane2 = plane.clone();
  //var plane2 = new THREE.Mesh(geometry, new THREE.)
  //plane2.rotation.x = Math.PI / 2;
  //plane2.position.z = -100;
  //scene.add(plane2);

  // SKYDOME

  var vertexShader = document.getElementById('vertexShader').textContent;
  var fragmentShader = document.getElementById('fragmentShader').textContent;
  var uniforms = {
    topColor: {
      type: "c",
      value: new THREE.Color(0x0077ff)
    },
    bottomColor: {
      type: "c",
      value: new THREE.Color(0xffffff)
    },
    offset: {
      type: "f",
      value: 33
    },
    exponent: {
      type: "f",
      value: 0.6
    }
  };
  uniforms.topColor.value.copy(hemiLight.color);

  scene.fog.color.copy(uniforms.bottomColor.value);

  var skyGeo = new THREE.SphereGeometry(4000, 32, 15);
  var skyMat = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms,
    side: THREE.BackSide
  });

  var sky = new THREE.Mesh(skyGeo, skyMat);
  //scene.add(sky);

  geometry = new THREE.BoxGeometry(200, 2000, 100);
  //geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
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
  //giantBox.receiveShadow = true;

  geometry = new THREE.SphereGeometry(20, 30, 20);
  //geometry.position.z = -10;
  var ball = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0xffffff,
    shininess: 20,
    shading: THREE.FlatShading
  }));
  //ball.position.x = 40;
  ball.position.z = 50;
  ball.position.y = 30;
  ball.castShadow = true;
  ball.receiveShadow = true;

  scene.add(ball);

  geometry = new THREE.BoxGeometry(10, 10, 10);
  material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0xffffff,
    shininess: 20,
  });
  cube = new THREE.Mesh(geometry, material);
  cube.position.x = -20;
  cube.position.y = 10;
  cube.position.z = 30;
  scene.add(cube);
  cube.castShadow = true;

  var loader = new THREE.JSONLoader();

  loader.load("model/bird.js", function (geometry) {

    morphColorsToFaceColors(geometry);
    geometry.computeMorphNormals();

    var material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0xffffff,
      shininess: 20,
      morphTargets: true,
      morphNormals: true,
      vertexColors: THREE.FaceColors,
      shading: THREE.FlatShading
    });
    var meshAnim = new THREE.MorphAnimMesh(geometry, material);

    meshAnim.duration = 1000;

    var s = 0.35;
    meshAnim.scale.set(s, s, s);
    meshAnim.position.y = 15;
    meshAnim.rotation.y = -1;

    meshAnim.castShadow = true;
    meshAnim.receiveShadow = true;

    scene.add(meshAnim);
    morphs.push(meshAnim);

  });

  var loader2 = new THREE.BinaryLoader();
  loader2.load("model/box.js", function (geometry, materials) {

    var material = new THREE.MeshPhongMaterial({
      color: 0xffeeaa,
      specular: 0x888888,
      shininess: 200
    });
    var object = new THREE.Mesh(geometry, material);
    object.scale.multiplyScalar(20);
    //object.position.z = 40;
    object.position.y = -10;
    //scene.add(object);
    object.receiveShadow = true;

  });

  /*
//-------------------------------------
  // renderer
  //
*/
  container = document.getElementById('container');
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  renderer.setClearColor(scene.fog.color, 1);

  renderer.gammaInput = true;
  renderer.gammaOutput = true;

  renderer.shadowMapEnabled = true;
  renderer.shadowMapCullFace = THREE.CullFaceBack;

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  stats.domElement.style.zIndex = 100;
  container.appendChild(stats.domElement);

  //
  // document.addEventListener('mousedown', onDocumentMouseDown, false);
  // document.addEventListener('mousemove', onDocumentMouseMove, false);
  // document.addEventListener('mouseup', onDocumentMouseUp, false);
  // document.addEventListener('mousewheel', onDocumentMouseWheel, false);
  // document.addEventListener('DOMMouseScroll', onDocumentMouseWheel, false);
  window.addEventListener('resize', onWindowResize, false);

  //

  render();

}

window.onkeydown = function () {
  console.log(camera.position);
};

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

function morphColorsToFaceColors(geometry) {

  if (geometry.morphColors && geometry.morphColors.length) {

    var colorMap = geometry.morphColors[0];

    for (var i = 0; i < colorMap.colors.length; i++) {

      geometry.faces[i].color = colorMap.colors[i];

    }

  }

}

function onDocumentMouseDown(event) {

  event.preventDefault();

  isUserInteracting = true;

  onPointerDownPointerX = event.clientX;
  onPointerDownPointerY = event.clientY;

  onPointerDownLon = lon;
  onPointerDownLat = lat;

}

function onDocumentMouseMove(event) {

  if (isUserInteracting === true) {

    lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
    lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;

  }

}

function onDocumentMouseUp(event) {

  isUserInteracting = false;

}

function onDocumentMouseWheel(event) {

  // WebKit

  if (event.wheelDeltaY) {

    camera.fov -= event.wheelDeltaY * 0.05;

    // Opera / Explorer 9

  } else if (event.wheelDelta) {

    camera.fov -= event.wheelDelta * 0.05;

    // Firefox

  } else if (event.detail) {

    camera.fov += event.detail * 1.0;

  }

  camera.updateProjectionMatrix();

}

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

  camera.position.z += 0.2;

  // if (isUserInteracting === false) {

  //   lon += 0.1;

  // }

  // lat = Math.max(-85, Math.min(85, lat));
  // phi = THREE.Math.degToRad(90 - lat);
  // theta = THREE.Math.degToRad(lon);

  // camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
  // camera.target.y = 500 * Math.cos(phi);
  // camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
  // camera.lookAt(camera.target);

  var delta = clock.getDelta();
  /*
  // distortion
  camera.position.copy( camera.target ).negate();
  */

  //controls.update();

  for (var i = 0; i < morphs.length; i++) {

    morph = morphs[i];
    morph.updateAnimation(1000 * delta);

  }

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

  areaLight1.position.x = Math.sin(Date.now() * 0.001) * 9;
  areaLight1.position.y = Math.sin(Date.now() * 0.0013) * 5 + 5;

  controls.update();

  render();

}

function render() {
  // renderer = new THREE.WebGLRenderer({
  //   antialias: true
  // });
  // renderer.shadowMapEnabled = true;
  // renderer.shadowMapType = THREE.PCFShadowMap;
  renderer.render(scene, camera);
  stats.update();

}