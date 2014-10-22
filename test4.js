if (!Detector.webgl) Detector.addGetWebGLMessage();
var colors = [
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
var colorIndex = 0;

var container, stats;
var camera, controls, scene, renderer;
var projector, plane, cube;
var mouse2D, mouse3D, raycaster,
  rollOveredFace, isShiftDown = false,
  theta = 45 * 0.5,
  isCtrlDown = false;

var rollOverMesh, rollOverMaterial;
var voxelPosition = new THREE.Vector3(),
  tmpVec = new THREE.Vector3(),
  normalMatrix = new THREE.Matrix3();
var cubeGeo, cubeMaterial;
var i, intersector;

var mystack, myque;

var objects = [];

init();
animate();

function init() {

  container = document.createElement('div');
  document.body.appendChild(container);

  var info = document.createElement('div');
  info.style.position = 'absolute';
  info.style.top = '10px';
  info.style.width = '100%';
  info.style.textAlign = 'center';
  info.innerHTML = '<a href="http://threejs.org" target="_blank">three.js</a> - voxel painter - webgl<br><strong>click</strong>: add voxel, <strong>shift + click</strong>: remove voxel, <strong>control</strong>: rotate';
  container.appendChild(info);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.x = 200;
  camera.position.y = 200;
  camera.position.z = 1200;

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

  // roll-over helpers

  rollOverGeo = new THREE.BoxGeometry(50, 50, 50);
  rollOverMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    opacity: 0.5,
    transparent: true
  });
  rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
  scene.add(rollOverMesh);

  // cubes

  cubeGeo = new THREE.BoxGeometry(50, 50, 50);
  cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0xfeb74c,
    ambient: 0x00ff80,
    shading: THREE.FlatShading
    /*,
				map: THREE.ImageUtils.loadTexture("textures/square-outline-textured.png")*/
  });
  cubeMaterial.ambient = cubeMaterial.color;

  // picking

  projector = new THREE.Projector();

  // grid

  var size = 200,
    step = 50;

  var geometry = new THREE.Geometry();

  for (var i = -size; i <= size; i += step) {

    geometry.vertices.push(new THREE.Vector3(-size, 0, i));
    geometry.vertices.push(new THREE.Vector3(size, 0, i));

    geometry.vertices.push(new THREE.Vector3(i, 0, -size));
    geometry.vertices.push(new THREE.Vector3(i, 0, size));

  }

  var material = new THREE.LineBasicMaterial({
    color: 0x222222,
    opacity: 0.2,
    transparent: true
  });

  var line = new THREE.Line(geometry, material);
  line.type = THREE.LinePieces;
  scene.add(line);

  var line1 = line.clone();
  line1.position.y = 200;
  line1.position.z = -200;
  line1.rotation.x = Math.PI / 2;

  for (i = 0; i < 8; i++) {
    lineN = line.clone();
    lineN.position.y = i * 50;
    //scene.add(lineN);
  }

  scene.add(line1);

  plane = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshBasicMaterial({
    color: 0xffffff,
    opacity: 0.4,
    transparent: true
  }));
  plane.rotation.x = -Math.PI / 2;
  //plane.visible = false;
  scene.add(plane);

  var plane1 = plane.clone();
  plane1.position.y = 100;
  plane1.position.z = -100;
  plane1.rotation.x = Math.PI / 2;
  scene.add(plane1);

  objects.push(plane);
  objects.push(plane1);

  geometry = new THREE.BoxGeometry(400, 400, 400);
  var gianBox = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
    color: 0xffffff,
    opacity: 0.4,
    transparent: true
  }));
  gianBox.position.y = 200;
  scene.add(gianBox);
  //objects.push(gianBox);

  geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3(-200, 400, -200),
    new THREE.Vector3(-200, 400, 200),
    new THREE.Vector3(200, 400, 200),
    new THREE.Vector3(200, 400, -200)
  );
  var boundary1 = new THREE.Line(geometry, new THREE.LineBasicMaterial({
    color: 0xffffff
  }));
  scene.add(boundary1);

  geometry.vertices.push(
    new THREE.Vector3(-200, 400, 200),
    new THREE.Vector3(-200, 0, 200),
    new THREE.Vector3(200, 0, 200),
    new THREE.Vector3(200, 400, 200)
  );
  var boundary2 = new THREE.Line(geometry, new THREE.LineBasicMaterial({
    color: 0xffffff
  }));
  scene.add(boundary2);

  mouse2D = new THREE.Vector3(0, 10000, 0.5);
  //objects.push(mystack.gianBox);

  for (i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      var box = new Box(colors[colorIndex]);
      colorIndex++;
      if (colorIndex > colors.length) {
        colorIndex = 0;
      }
      box.mesh.position.x = i * 100 - 600 + Math.random() * 30;
      box.mesh.position.z = j * 100 - 1000 + Math.random() * 30;
      box.mesh.position.y = -600;
    }
  }

  geometry = new THREE.PlaneGeometry(10000, 10000);
  ground = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
    color: 0xffffff,
    opacity: 0.6,
    transparent: true
  }));
  ground.position.y = -500;
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  mystack = new myStack(4, 10, -250, 0);

  // Lights

  var ambientLight = new THREE.AmbientLight(0x606060);
  scene.add(ambientLight);

  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 0.75, 0.5).normalize();
  scene.add(directionalLight);

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setClearColor(0xf0f0f0);
  renderer.setSize(window.innerWidth, window.innerHeight);

  container.appendChild(renderer.domElement);

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  container.appendChild(stats.domElement);

  container.addEventListener('mousemove', onDocumentMouseMove, false);
  container.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('keydown', onDocumentKeyDown, false);
  document.addEventListener('keyup', onDocumentKeyUp, false);

  //

  window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function getRealIntersector(intersects) {

  for (i = 0; i < intersects.length; i++) {

    intersector = intersects[i];

    if (intersector.object != rollOverMesh) {

      return intersector;

    }

  }

  return null;

}

function setVoxelPosition(intersector) {

  if (intersector.face === null) {

    console.log(intersector)

  }

  normalMatrix.getNormalMatrix(intersector.object.matrixWorld);

  tmpVec.copy(intersector.face.normal);
  tmpVec.applyMatrix3(normalMatrix).normalize();

  voxelPosition.addVectors(intersector.point, tmpVec);
  voxelPosition.divideScalar(50).floor().multiplyScalar(50).addScalar(25);

}

function onDocumentMouseMove(event) {
  if (!show2dcanvas) {

    event.preventDefault();

    mouse2D.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse2D.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

}

function onDocumentMouseDown(event) {
  if (!show2dcanvas) {

    event.preventDefault();

    var intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {

      intersector = getRealIntersector(intersects);

      // delete cube

      if (isShiftDown) {

        if (intersector.object != plane) {

          scene.remove(intersector.object);

          objects.splice(objects.indexOf(intersector.object), 1);

        }

        // create cube

      } else {

        intersector = getRealIntersector(intersects);
        setVoxelPosition(intersector);

        var voxel = new THREE.Mesh(cubeGeo, cubeMaterial);
        voxel.position.copy(voxelPosition);
        voxel.matrixAutoUpdate = false;
        voxel.updateMatrix();
        scene.add(voxel);

        objects.push(voxel);

      }
    }
  }
}

var show2dcanvas = false;

function onDocumentKeyDown(event) {
  event.preventDefault();
  switch (event.keyCode) {
  case 16:
    isShiftDown = true;
    break;
  case 17:
    isCtrlDown = true;
    break;
  case 13:
    mystack.isPop = !mystack.isPop;
    break;
  case 32:
    show2dcanvas = !show2dcanvas;
    if (show2dcanvas) {
      document.getElementById('canvas2d').style.display = 'block';
    } else {
      document.getElementById('canvas2d').style.display = 'none';
    }
  }

}

function onDocumentKeyUp(event) {

  switch (event.keyCode) {

  case 16:
    isShiftDown = false;
    break;
  case 17:
    isCtrlDown = false;
    break;

  }

}

//

function animate() {

  requestAnimationFrame(animate);
  mystack.pop();
  if (!show2dcanvas) {
    controls.update();
  }
  render();
  stats.update();

}

function render() {

  if (isCtrlDown) {

    theta += mouse2D.x * 1.5;

  }

  raycaster = projector.pickingRay(mouse2D.clone(), camera);

  var intersects = raycaster.intersectObjects(objects);

  if (intersects.length > 0) {

    intersector = getRealIntersector(intersects);

    if (intersector) {

      setVoxelPosition(intersector);
      rollOverMesh.position.copy(voxelPosition);

    }

  }

  //camera.position.x = 1400 * Math.sin(THREE.Math.degToRad(theta));
  //camera.position.z = 1400 * Math.cos(THREE.Math.degToRad(theta));

  //camera.lookAt(scene.position);

  renderer.render(scene, camera);

}