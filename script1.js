(function (exports) {
  var container;
  var camera, scene, controls, renderer, stats;
  var plane, cube;

  var vector, raycaster, isShiftDown = false;

  var rollOverMesh, rollOverMaterial;
  var cubeGeo, cubeMaterial;
  var loader;
  var target, you;
  var obstacles = [];

  var objects = [];
  var frameRate = 0;

  init();
  animate();

  function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(500, 800, 1300);
    camera.lookAt(new THREE.Vector3());

    scene = new THREE.Scene();
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

    // roll-over helpers
    /*
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
    });
    cubeMaterial.ambient = cubeMaterial.color;
    */

    // grid

    var size = 500,
      step = 50;

    var geometry = new THREE.Geometry();

    for (var i = -size; i <= size; i += step) {

      geometry.vertices.push(new THREE.Vector3(-size, 0, i));
      geometry.vertices.push(new THREE.Vector3(size, 0, i));

      geometry.vertices.push(new THREE.Vector3(i, 0, -size));
      geometry.vertices.push(new THREE.Vector3(i, 0, size));

    }

    var material = new THREE.LineBasicMaterial({
      color: 0x000000,
      opacity: 0.2,
      transparent: true
    });

    var line = new THREE.Line(geometry, material);
    line.type = THREE.LinePieces;
    scene.add(line);

    //

    vector = new THREE.Vector3();
    raycaster = new THREE.Raycaster();

    geometry = new THREE.PlaneBufferGeometry(1000, 1000);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

    plane = new THREE.Mesh(geometry);
    plane.visible = false;
    plane.name = "floor";
    scene.add(plane);

    objects.push(plane);

    //target
    material = new THREE.MeshLambertMaterial({
      color: 0xbb2222
    });
    target = new THREE.Mesh(cubeGeo, material);
    target.position.x = -475;
    target.position.y = 56;
    target.position.z = -475;
    target.name = "target";
    scene.add(target);
    objects.push(target);

    //you
    // loader = new THREE.JSONLoader();
    // you = new Guy();
    // you.loadThings();
    material = new THREE.MeshLambertMaterial({
      color: 0x0000bb
    });
    you = new THREE.Mesh(cubeGeo, material);
    you.position.x = 475;
    // you.position.y = 56;
    you.position.y = 26;
    you.position.z = 475;
    you.idle = true;
    you.direction = 'front';
    scene.add(you);
    //objects.push(you);

    //obstacles

    for (j = 0; j < 20; j++) {
      var x = -475 + Math.floor(Math.pow(Math.random(), 2) * 20) * 50;
      //var y = 25 * (j % 2 + 1);
      //var y = 25;
      var y;
      if (Math.random() > 0.7) {
        y = 25 + Math.floor(Math.random() * 6) * 50;
      } else {
        y = 25;
      }
      var z = -475 + Math.floor(Math.pow(Math.random(), 2) * 20) * 50;

      if ((x === target.position.x && z === target.position.z) && (y === target.position.y || y === target.position.y + 50)) {} else {
        if (x === -475 && y === 25 & z === 475) {} else {
          mesh = new THREE.Mesh(cubeGeo, cubeMaterial);
          mesh.position.x = x;
          mesh.position.y = y;
          mesh.position.z = z;
          mesh.name = "obstacle";
          scene.add(mesh);
          objects.push(mesh);
        }
      }

      if (Math.random() > 0.5) {
        upMesh = mesh.clone();
        upMesh.position.y = 50;
        // if (Math.random() > 0.5) {
        //    upMesh.position.x += 50;
        // }
        upMesh.name = "obstacle";
        scene.add(upMesh);
        objects.push(upMesh);
      }

    }

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

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);

    //
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.left = '0px';
    document.body.appendChild(stats.domElement);

    window.addEventListener('resize', onWindowResize, false);

    render();

  }

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    controls.handleResize();
    renderer.setSize(window.innerWidth, window.innerHeight);

  }

  function checkBounce() {
    var test = new THREE.Vector3(you.position.x, you.position.y, you.position.z);
    test.unproject(camera);
    raycaster.ray.set(camera.position, test.sub(camera.position).normalize());
    var intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0) {
      console.log(intersects[0]);
      //return true;
    } else {
      //return false;
    }
  }

  function onDocumentMouseMove(event) {

    event.preventDefault();

    vector.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
    vector.unproject(camera);

    raycaster.ray.set(camera.position, vector.sub(camera.position).normalize());

    var intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {

      var intersect = intersects[0];

      //console.log(intersect);

      //rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
      //rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);

    }

    render();

  }

  function onDocumentMouseDown(event) {

    event.preventDefault();

    vector.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
    vector.unproject(camera);

    raycaster.ray.set(camera.position, vector.sub(camera.position).normalize());

    var intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {

      var intersect = intersects[0];

      console.log(intersect);

      // delete cube

      if (isShiftDown) {

        if (intersect.object != plane) {

          scene.remove(intersect.object);

          objects.splice(objects.indexOf(intersect.object), 1);

        }

        // create cube

      } else {

        var voxel = new THREE.Mesh(cubeGeo, cubeMaterial);
        voxel.position.copy(intersect.point).add(intersect.face.normal);
        //console.log(voxel.position.x, voxel.position.y, voxel.position.z);
        voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
        //console.log(voxel.position.x, voxel.position.y, voxel.position.z);
        scene.add(voxel);
        objects.push(voxel);

      }

      render();

    }

  }

  function animate() {
    requestAnimationFrame(animate);

    if (frameRate % 2 === 0) {
      render();
    }

    frameRate++;
    var now = new Date().getTime();
    target.position.y += Math.sin(now * 0.002);
    // if (you.idle) {
    //   you.position.y += Math.sin(now * 0.002);
    // } else {
    //   you.position.y = 25;
    // }
    stats.update();
    controls.update();
  }

  function render() {

    renderer.render(scene, camera);

  }

  exports.you = you;
  exports.camera = camera;
  //exports.render = render;
  exports.checkBounce = checkBounce;

})(this);