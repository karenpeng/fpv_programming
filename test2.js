if (!Detector.webgl) Detector.addGetWebGLMessage();
var container, controls;
var camera, scene, light, renderer;
var light1, light2, light3;
var geometry, material, object, mesh;
var mouseX = 0,
  mouseY = 0;
var clock = new THREE.Clock();
var guy;
var cube;
var loader;

init();
animate();

function init() {
  container = document.createElement('div');
  document.body.appendChild(container);
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 15000);
  //camera.position.z = 500;
  camera.position.z = 70;
  camera.position.y = 20;
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
  scene.fog = new THREE.Fog(0xffffff, 1, 1500);

  light = new THREE.PointLight(0x22aa22);
  light.position.set(100, 100, 100);
  scene.add(light);

  light = new THREE.PointLight(0xaa2222);
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

  var sphere = new THREE.SphereGeometry(0.1, 16, 8);

  var intensity = 2.5;
  var distance = 20;
  var c1 = 0xff0040,
    c2 = 0x0040ff,
    c3 = 0x80ff80,
    c4 = 0xffaa00,
    c5 = 0x00ffaa,
    c6 = 0xff1100;

  light1 = new THREE.PointLight(c1, intensity, distance);
  light1.add(new THREE.Mesh(sphere, new THREE.MeshLambertMaterial({
    color: c1
  })));
  //scene.add(light1);

  light2 = new THREE.PointLight(c2, intensity, distance);
  light2.add(new THREE.Mesh(sphere, new THREE.MeshLambertMaterial({
    color: c2
  })));
  //scene.add(light2);

  light3 = new THREE.PointLight(c3, intensity, distance);
  light3.add(new THREE.Mesh(sphere, new THREE.MeshLambertMaterial({
    color: c3
  })));
  //scene.add(light3);

  geometry = new THREE.PlaneGeometry(1000, 2000);
  //geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
  //geometry.rotation.x = -Math.PI / 2;
  material = new THREE.MeshPhongMaterial({
    color: 0xffffff
  });
  var ground = new THREE.Mesh(geometry, material);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -12;
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

  //scene.add(mesh);

  loader = new THREE.JSONLoader();
  // loader.load("model/guy.js", function (geometry1) {
  // 		material = new THREE.MeshPhongMaterial({
  // 				color: 0xaaaaaa
  // 		});
  // 		guy = new THREE.Mesh(geometry1, material);
  // 		guy.scale.set(2, 2, 2);
  // 		guy.position.y = -12;
  // 		guy.position.z = 40;
  // 		guy.castShadow = true;
  // 		//console.log(guy);
  // 		scene.add(guy);
  // });
  guy = new Guy();
  guy.loadThings();

  geometry = new THREE.BoxGeometry(10, 10, 10);
  geometry.vertucesNeedUpdate = true;
  material = new THREE.MeshPhongMaterial({
    color: 0xffaaaa
  });
  cube = new THREE.Mesh(geometry, material);
  cube.position.y = -10;
  cube.position.x = -20;
  cube.castShadow = true;

  //scene.add(cube);

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

function Guy() {
  this.geometry;
  this.material;
  this.mesh;
  this.loaded = false;
  this.stop1 = true;
  this.stop0 = false;
  this.interalClock = 0;

  this.loadThings = function () {
    var that = this;
    loader.load("model/guy.js", function (geometry1) {
      that.geometry = geometry1;
      that.material = new THREE.MeshPhongMaterial({
        color: 0xffffff
      });
      that.mesh = new THREE.Mesh(geometry1, material);
      that.mesh.scale.set(2, 2, 2);
      that.mesh.position.y = -12;
      //that.mesh.position.z = 40;
      that.mesh.castShadow = true;
      //console.log(guy);
      that.loaded = true;
      scene.add(that.mesh);
    });
  };
  this.walk = function (theta) {

    // if (this.stop1) {
    //   this.geometry.vertices[0].z = this.interalClock % 6 - 3;
    //this.interalClock += 0.1;
    // }
    // // if (theta < 20) {
    // //   console.log(this.geometry.vertices[0].z)
    // // }
    // //when it is 1.25 max	//stop it, move the other leg
    // if (this.geometry.vertices[0].z > 2.9) {
    //   //console.log("ouch")
    //   this.stop0 = true;
    //   this.stop1 = false;
    //   this.interalClock = 0;
    // }

    // if (this.stop0) {
    //   this.geometry.vertices[1].z = this.interalClock % 6 - 3;
    //   this.interalClock += 0.1;
    // }

    // //when the other leg is

    // if (this.geometry.vertices[1].z > 2.9) {
    //   this.stop1 = true;
    //   this.stop0 = false;
    //   this.interalClock = 0;
    // }

    // if (this.stop1) {
    //   this.geometry.vertices[0].z = Math.sin(this.interalClock) * 1.25;
    //   this.interalClock += 0.1;
    // }

    // if (this.geometry.vertices[0].z > 1.24) {
    //   this.stop1 = false;
    //   this.stop0 = true;
    //   this.geometry.vertices[0].z = 1.25;
    //   this.interalClock = 0;
    // }

    // if (this.stop0) {
    //   this.geometry.vertices[1].z = Math.sin(this.interalClock) * 1.25;
    //   this.interalClock += 0.1;
    // }

    // if (this.geometry.vertices[1].z > 1.24) {
    //   this.stop0 = false;
    //   this.stop1 = true;
    //   this.geometry.vertices[1].z = 1.25;
    //   this.interalClock = 0;
    // }
    // console.log(this.geometry.vertices[0].z, this.geometry.vertices[1].z, this.interalClock)

    this.geometry.vertices[0].z = Math.sin(theta) * 1.5;
    this.geometry.vertices[1].z = Math.sin(theta + Math.PI) * 1.5;
    this.mesh.position.z = Math.sin(theta * 0.1) * 20;
    this.mesh.position.x = Math.cos(theta * 0.1) * 20;
    this.mesh.rotation.y = -theta * 0.1;
    //if (theta < 4) {
    for (var i = 2; i < 6; i++) {
      //console.log(i + ", " + this.geometry.vertices[0].y)
      if (i % 2 == 0) {
        this.geometry.vertices[i].y = Math.sin(theta) * 0.3 + 3
      } else {
        this.geometry.vertices[i].y = Math.sin(theta + Math.PI) * 0.3 + 3
      }
    }
    //}
  };
  this.swagger = function () {
    this.geometry.vertices[0].z = Math.sin(theta) * 1.5;
    this.geometry.vertices[1].z = Math.sin(theta + Math.PI) * 1.5;
    this.geometry.vertices[0].y = Math.sin(theta + Math.PI / 2) * 0.6 + 0.6;
    this.geometry.vertices[1].y = Math.sin(theta + Math.PI * 3 / 2) * 0.6 + 0.6;
    this.mesh.position.z = Math.sin(theta * 0.12) * 20;
    this.mesh.position.x = Math.cos(theta * 0.12) * 20;
    this.mesh.rotation.y = -theta * 0.12;
    //if (theta < 4) {
    for (var i = 2; i < 6; i++) {
      //console.log(i + ", " + this.geometry.vertices[0].y)
      if (i % 2 == 0) {
        this.geometry.vertices[i].y = Math.sin(theta) * 0.8 + 4
      } else {
        this.geometry.vertices[i].y = Math.sin(theta + Math.PI) * 0.8 + 4
      }
    }
  }
  this.broadjump = function () {
    this.geometry.vertices[0].y = Math.sin(theta) + 1;
    this.geometry.vertices[1].y = Math.sin(theta) + 1;
    for (var i = 2; i < 6; i++) {
      //console.log(i + ", " + this.geometry.vertices[0].y)
      if (i > 3) {
        this.geometry.vertices[i].y = Math.cos(theta) * 0.6 + 5;
      } else {
        this.geometry.vertices[i].y = Math.sin(theta) * 0.6 + 5;
      }
    }
    this.mesh.position.y = Math.sin(theta) * 2.2 - 10.8;
    this.mesh.position.z = Math.sin(theta * 0.15) * 20;
    this.mesh.position.x = Math.cos(theta * 0.15) * 20;
    this.mesh.rotation.y = -theta * 0.15;
  };
  this.no = function (theta) {
    //  for (var i = 2; i < 6; i++) {
    //   this.geometry.vertices[i].x -= Math.sin(theta) * 0.2;
    //   this.geometry.vertices[i].z += Math.cos(theta) * 0.2;

    if (Math.sin(theta) < 0) {
      this.mesh.rotation.y = 0.3 * Math.sin(theta);
      // this.geometry.vertices[i].x = Math.sin(theta) * 0.2;
      // this.geometry.vertices[i].z = Math.cos(theta) * 0.2;
    } else {
      this.mesh.rotation.y = 0.3 * Math.sin(theta);
      // this.geometry.vertices[i].x = Math.sin(theta) * 0.2;
      // this.geometry.vertices[i].z = Math.cos(theta) * 0.2;
    }
    //  }
  };
  this.update = function (theta) {
    //console.log(this.loa)
    if (this.loaded) {
      this.geometry.verticesNeedUpdate = true;
      //this.walk(theta);
      //this.swagger(theta);
      //this.broadjump(theta);
      this.no(theta);
    }
  };

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
  //theta++;
  theta += 0.2;
  var time = Date.now() * 0.00025;
  //mesh.rotation.y += 0.01;

  //mesh.morphTargetInfluences[ 0 ] = Math.sin( mesh.rotation.y ) * 0.5 + 0.5;

  //camera.position.x += ( mouseX - camera.position.x ) * .005;
  //camera.position.y += (-mouseY - camera.position.y) * .01;
  geometry.verticesNeedUpdate = true;
  mesh.morphTargetInfluences[0] = (Math.sin(theta) + 1);
  // geometry.vertices[0].x += Math.cos(theta);
  geometry.vertices[2].x = Math.floor((Math.cos(theta) + 1) * 5);
  geometry.vertices[7].x = Math.floor((Math.sin(theta) + 1) * -5);
  //console.log(geometry.vertices[7].x)

  cube.position.y = Math.sin(theta * 0.5) * 10;
  //console.log(clock.elapsedTime);
  //console.log(geometry.vertices[0].x)
  guy.update(theta);
  var z = 20,
    d = 60;

  light1.position.x = Math.sin(time * 0.7) * d;
  light1.position.z = Math.cos(time * 0.3) * d;

  light2.position.x = Math.cos(time * 0.3) * d;
  light2.position.z = Math.sin(time * 0.7) * d;

  light3.position.x = Math.sin(time * 0.9) * d;
  light3.position.z = Math.sin(time * 0.5) * d;

  render();
  controls.update();
}

var theta = 0;

function render() {

  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}