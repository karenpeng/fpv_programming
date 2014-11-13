var camera, scene, controls, light, renderer;
var geometry, material, mesh;
var guy, loader;
var theta = 0;

init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
  camera.position.z = 1000;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xcccccc, 2, 800);

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

  // lights

  light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1, 1, 1000);
  scene.add(light);

  light = new THREE.DirectionalLight(0x002288);
  light.position.set(-1, -1, -1000);
  scene.add(light);

  light = new THREE.AmbientLight(0x222222);
  scene.add(light);

  scene = new THREE.Scene();

  var spotLight = new THREE.SpotLight(0xffffff, 10, 10000);
  spotLight.position.set(100, 1000, -100);
  //spotLight.castShadow = true;
  scene.add(spotLight);

  //Meshes

  geometry = new THREE.BoxGeometry(200, 200, 200);
  material = new THREE.MeshBasicMaterial({
    color: 0xff0000
  });

  mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = -1000;
  //mesh.castShadow = true;
  scene.add(mesh);

  geometry = new THREE.PlaneGeometry(10000, 10000, 15, 5);
  material = new THREE.MeshBasicMaterial({
    color: 0x2222bb
  });
  mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -200;
  mesh.position.z = -2000;
  //mesh.receiveShadow = true;
  scene.add(mesh);

  loader = new THREE.JSONLoader();
  guy = new Guy();
  guy.loadThings();

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.shadowMapEnabled = true;
  renderer.setClearColor(0xffffff);
  renderer.setSize(window.innerWidth, window.innerHeight);

  container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  //
  window.addEventListener('resize', onWindowResize, false);
  //
  render();
}

function Guy() {
  this.geometry;
  this.material;
  this.mesh;
  this.loaded = false;

  this.loadThings = function () {
    var that = this;
    loader.load("model/guy.js", function (geometry1) {
      that.geometry = geometry1;
      that.material = new THREE.MeshBasicMaterial({
        color: 0x00aaaa
      });
      that.mesh = new THREE.Mesh(that.geometry, that.material);
      that.mesh.scale.set(20, 20, 20);
      that.mesh.position.y = -100;
      that.mesh.position.z = 600;
      that.loaded = true;
      scene.add(that.mesh);
    });
  };
  this.walk = function (theta) {
    if (this.loaded) {
      this.geometry.verticesNeedUpdate = true;
      this.geometry.vertices[0].z = Math.sin(theta) * 1.5;
      this.geometry.vertices[1].z = Math.sin(theta + Math.PI) * 1.5;
      for (var i = 2; i < 6; i++) {
        if (i % 2 === 0) {
          this.geometry.vertices[i].y = Math.sin(theta) * 0.3 + 3;
        } else {
          this.geometry.vertices[i].y = Math.sin(theta + Math.PI) * 0.3 + 3;
        }
      }
    }
  };
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  controls.handleResize();

  render();

}

function animate() {
  theta += 0.1;
  // note: three.js includes requestAnimationFrame shim
  requestAnimationFrame(animate);
  controls.update();
  guy.walk(theta);
  render();
}

function render() {

  renderer.render(scene, camera);

}