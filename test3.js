if (!Detector.webgl) Detector.addGetWebGLMessage();
var container, controls;
var camera, scene, light, renderer;
var geometry, material, object, mesh;
var guy;
var cube;
var loader;
var guyGeometry;
var guys = [];
var box;
var colorChoice = [
  /* green */
  0x1abc9c,

  /* yellow */
  0xf1c40f,

  /* rust */
  0xd35400,

  /* dark green */
  0x27ae60,

  /* dark blue */
  0x006CB7,

  /* light blue */
  0x3498db,

  /* violet */
  0x8e44ad,

  /* brick */
  0xe74c3c,

  /* peach */
  0xF47E43,

  /* dark violet */
  0x752763,

  /* dull green */
  0x4D947A,

  /* raspberry */
  0xDA4952,

  /* navy blue */
  0x2E4DA7

];
noise.seed(Math.random());

init();
animate();

function init() {
  container = document.createElement('div');
  document.body.appendChild(container);
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 15000);
  //camera.position.z = 500;
  camera.position.z = 160;
  camera.position.y = 50;
  camera.position.x = 10;
  //camera.target = new THREE.Vector3(0, -10, 0);

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
  scene.fog = new THREE.Fog(0xffffff, 1, 1500);

  light = new THREE.PointLight(0xffffff);
  light.position.set(100, 100, 100);
  scene.add(light);

  light = new THREE.PointLight(0xffffff);
  light.position.set(-100, -100, 100);
  scene.add(light);

  var dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight.color.setHSL(0.1, 1, 0.95);
  dirLight.position.set(-1, 10.75, 1);
  dirLight.position.multiplyScalar(150);
  scene.add(dirLight);
  dirLight.castShadow = true;

  dirLight.shadowMapWidth = 2048;
  dirLight.shadowMapHeight = 2048;

  var d = 50;

  dirLight.shadowCameraLeft = -d;
  dirLight.shadowCameraRight = d;
  dirLight.shadowCameraTop = d;
  dirLight.shadowCameraBottom = -d;

  dirLight.shadowCameraFar = 35000;
  dirLight.shadowBias = -0.0001;
  dirLight.shadowDarkness = 0.15;
  //dirLight.shadowCameraVisible =

  geometry = new THREE.PlaneGeometry(1000, 2000);
  //geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
  //geometry.rotation.x = -Math.PI / 2;
  material = new THREE.MeshPhongMaterial({
    color: 0xffffff
  });
  var ground = new THREE.Mesh(geometry, material);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  geometry = new THREE.BoxGeometry(10, 10, 10);
  material = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    morphTargets: true
  });

  loader = new THREE.JSONLoader();
  loader.load("model/guy.js", function (geometry1) {
    guyGeometry = geometry1;
    //console.log(guyGeometry)
    for (var i = 0; i < 10; i++) {
      guy = new Guy();
      if (i < 4) {
        guy.init(-30, i * 10 + 8, 0, colorChoice[i]);
      } else {
        guy.init(i * 10 - 30, 8, 0, colorChoice[i]);
      }
      guys.push(guy);
    }

    //guy.init()

    geometry = new THREE.BoxGeometry(14, 72, 14);
    material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.4
    });
    box = new THREE.Mesh(geometry, material);
    box.position.x = -30;
    scene.add(box);
    geometry = new THREE.BoxGeometry(60, 14, 14);
    box = new THREE.Mesh(geometry, material);
    box.position.x = 33;
    box.position.y = 12;
    scene.add(box);
  });

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
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

function Guy() {
  this.geometry;
  this.material;
  this.mesh;
  this.loaded = false;
  this.stop1 = true;
  this.stop0 = false;
  this.interalClock = 0;

  this.init = function (_x, _y, _z, _color) {
    this.x = _x;
    this.y = _y;
    this.z = _z;
    this.geometry = guyGeometry;
    this.material = new THREE.MeshLambertMaterial({
      color: _color
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.scale.set(2, 2, 2);
    this.mesh.position.x = _x;
    this.mesh.position.y = _y;
    this.mesh.position.z = _z;
    this.mesh.castShadow = true;
    //this.mesh.receiveShadow = true;
    this.mesh.rotation.y = Math.PI / 2;
    scene.add(this.mesh);
  };
  this.float = function (theta, a) {
    this.mesh.position.y += ((noise.simplex2(theta * (a + 1) * 0.01, theta * (a + 1) * 0.01)) * 0.015);
    // console.log(noise.simplex2(theta * (a + 1) * 0.004, theta * (a + 1) * 0.004))
  };
  this.broadjump = function (theta) {
    this.geometry.verticesNeedUpdate = true;
    this.geometry.vertices[0].y = Math.sin(theta) * 0.6 + 0.6;
    this.geometry.vertices[1].y = +Math.sin(theta) * 0.6 + 0.6;
    for (var i = 2; i < 6; i++) {
      //console.log(i + ", " + this.geometry.vertices[0].y)
      if (i > 3) {
        this.geometry.vertices[i].y = Math.cos(theta) * 0.6 + 5;
      } else {
        this.geometry.vertices[i].y = Math.sin(theta) * 0.6 + 5;
      }
    }
    this.mesh.position.y = this.y + Math.sin(theta) * 2.2 - 10.8;
  };
}

var popPop0 = false;
var popPop2 = false;

function popPop() {

  if (!popPop0) {
    if (guys[3].mesh.position.y < 50) {
      guys[3].mesh.position.y += 0.4;
    } else if (guys[3].mesh.position.x < -6) {
      guys[3].mesh.position.y = 50;
      guys[3].mesh.position.x += 0.4;

    } else if (guys[3].mesh.position.y > 49) {
      guys[3].mesh.position.x = -6;
      popPop0 = true;
    }
  } else {
    if (guys[3].mesh.position.y < 50 && guys[3].mesh.position.y > 10) {
      guys[3].mesh.position.y -= 0.4;
    } else if (guys[3].mesh.position.y < 11) {

    } else if (guys[3].mesh.position.x < 10) {
      //guys[3].mesh.position.y = 10;
      guys[3].mesh.position.x += 0.4;
      popPop2 = true;
    }
  }
  if (popPop2) {
    guys.forEach(function (g, index) {
      if (index > 3 && g.mesh.position.x - g.x < 8) {
        g.mesh.position.x += 0.4;
      }
    });
    guys[9].mesh.position.x += 0.4;
  }
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
  theta += 0.1;
  if (guy !== undefined) {
    guys.forEach(function (g, index) {
      g.float(theta, index);
      //g.broadjump(theta);
    });
    if (theta > 4) {
      popPop();
    }
  }

  render();
  controls.update();
}

var theta = 0;

function render() {

  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}