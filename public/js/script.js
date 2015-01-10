(function (exports) {
  var container;
  var camera, scene, controls, renderer, stats;
  var cube;

  var vector, raycaster, isShiftDown = false;

  var rollOverMesh, rollOverMaterial;
  var cubeGeo, cubeMaterial;
  var line, plane, frontWall, backWall, leftWall, rightWall;
  var loader;
  var target, you, obstacle, upObstacle, friend;
  var obstacleMaterial;
  var va = 0;

  //>。<
  var obstacles = [];

  var objects = [];

  var frameRate = 0;

  var clock1, clock2;

  init();
  animate();

  function init(info) {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(500, 800, 1000);
    camera.lookAt(new THREE.Vector3());

    scene = new THREE.Scene();
    controls = new THREE.OrbitControls(camera);

    controls.damping = 0.2;
    //controls.addEventListener('change', render);

    // roll-over helpers

    rollOverGeo = new THREE.BoxGeometry(50, 50, 50);
    rollOverMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      opacity: 0.5,
      transparent: true
    });
    rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
    //scene.add(rollOverMesh);

    // cubes

    cubeGeo = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshLambertMaterial({
      color: 0xfeb74c,
      ambient: 0x00ff80,
      shading: THREE.FlatShading
    });
    cubeMaterial.ambient = cubeMaterial.color;

    // grid

    var size = 400,
      step = 50;

    var geometry = new THREE.Geometry();

    for (var i = -size; i <= size; i += step) {

      geometry.vertices.push(new THREE.Vector3(-size, 0, i));
      geometry.vertices.push(new THREE.Vector3(size, 0, i));

      geometry.vertices.push(new THREE.Vector3(i, 0, -size));
      geometry.vertices.push(new THREE.Vector3(i, 0, size));

    }

    var material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      opacity: 0.3,
      transparent: true
    });

    line = new THREE.Line(geometry, material);
    line.type = THREE.LinePieces;
    scene.add(line);

    //

    vector = new THREE.Vector3();
    raycaster = new THREE.Raycaster();

    geometry = new THREE.PlaneBufferGeometry(800, 800);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

    plane = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
      color: 0xffffff,
      map: THREE.ImageUtils.loadTexture("img/test_ground5.jpg")
        //,
        // transparent: true,
        // opacity: 0.2
    }));
    plane.receiveShaow = true;
    //plane.visible = false;
    plane.name = "floor";
    scene.add(plane);

    objects.push(plane);

    //back wall
    geometry = new THREE.PlaneBufferGeometry(800, 400);
    backWall = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
      color: 0xffffff
    }));
    backWall.name = "backBounce";
    backWall.position.z = -400;
    backWall.position.y = 200;
    backWall.visible = false;
    scene.add(backWall);
    objects.push(backWall);

    //left wall
    geometry = new THREE.PlaneBufferGeometry(800, 400);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI / 2));
    leftWall = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
      color: 0xffffff
    }));
    leftWall.name = "leftBounce";
    leftWall.position.x = -400;
    leftWall.position.y = 200;
    leftWall.visible = false;
    scene.add(leftWall);
    objects.push(leftWall);

    //right wall
    geometry = new THREE.PlaneBufferGeometry(800, 400);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationY(-Math.PI / 2));
    rightWall = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
      color: 0xffffff
    }));
    rightWall.name = "rightBounce";
    rightWall.position.x = 400;
    rightWall.position.y = 200;
    rightWall.visible = false;
    scene.add(rightWall);
    objects.push(rightWall);

    //front wall
    geometry = new THREE.PlaneBufferGeometry(800, 400);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI));
    frontWall = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
      color: 0xffffff
    }));
    frontWall.name = "frontBounce";
    frontWall.position.y = 200;
    frontWall.position.z = 400;
    frontWall.visible = false;
    scene.add(frontWall);
    objects.push(frontWall);

    //you
    material = new THREE.MeshLambertMaterial({
      color: 0xffff00
    });
    you = new THREE.Mesh(cubeGeo, material);
    you.position.x = 375;
    you.position.y = 25;
    you.position.z = 375;
    scene.add(you);
    //you and target can go through each other
    //objects.push(you);

    //friend
    material = new THREE.MeshLambertMaterial({
      color: 0x00ff00
    });
    friend = new THREE.Mesh(cubeGeo, material);
    friend.position.x = 375;
    friend.position.y = 25;
    friend.position.z = 375;

    //target
    material = new THREE.MeshLambertMaterial({
      color: 0xff0000
    });
    target = new THREE.Mesh(cubeGeo, material);
    target.name = "target";
    scene.add(target);
    //you and target can go through each other
    //objects.push(target);

    //obstacles
    obstacleMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      //shading: THREE.FlatShading,
      // map: THREE.ImageUtils.loadTexture("img/sheep" + Math.round(Math.random()) + ".png")
      map: THREE.ImageUtils.loadTexture("img/meow.jpg")
    });
    for (var j = 0; j < 24; j++) {
      obstacles[j] = new THREE.Mesh(cubeGeo, obstacleMaterial);
      obstacles[j].name = "cat";
      obstacles[j].position.y = 25;
      scene.add(obstacles[j]);
      objects.push(obstacles[j]);
    }

    // Lights

    var ambientLight = new THREE.AmbientLight(0x666666);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 0.75, 0.5).normalize();
    scene.add(directionalLight);

    renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setClearColor(0xfafaff);
    //renderer.setClearColor(0x2cc8ff);
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);

    //STATS
    // stats = new Stats();
    // stats.domElement.style.position = 'absolute';
    // stats.domElement.style.top = '0px';
    // stats.domElement.style.left = '0px';
    //document.body.appendChild(stats.domElement);

    window.addEventListener('resize', onWindowResize, false);

    //render();

  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    //render();

  }

  function isHit(obj, _index) {

    var rays = [
      //backward
      new THREE.Vector3(0, 0, 1),
      //forward
      new THREE.Vector3(0, 0, -1),
      //right
      new THREE.Vector3(1, 0, 0),
      //left
      new THREE.Vector3(-1, 0, 0),
      //up
      new THREE.Vector3(0, 1, 0),
      //down
      new THREE.Vector3(0, -1, 0)

    ];

    raycaster.ray.set(obj, rays[_index]);

    var intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0 && intersects[0].distance <= 25) {

      //console.log(intersects[0].object.name + " " + intersects[0].distance);
      return intersects[0].object.name;

    } else return null;

  }

  function animate() {

    if (frameRate % 3 === 0) {
      render();
      controls.update();
      //stats.update();
    }

    var choices = ['d', 'l', 'f', 'r', 'b', 'u'];

    if (!realGame && frameRate % 1800 === 0 && frameRate !== 0 && level > 3) {
      var steps = Math.round(Math.random() * 2) + 1;
      var instructions = [];
      for (var i = 0; i < steps; i++) {
        instructions.push(choices[Math.round(Math.random() * 5)]);
      }
      flashandMoveTarget(instructions);
    }

    frameRate++;

    requestAnimationFrame(animate);

  }

  function render() {

    renderer.render(scene, camera);

  }

  function restart(data) {
    scene.remove(you);
    //will this add you twice when restart?
    scene.add(friend);
    scene.add(you);
    friend.position.x = 375;
    friend.position.y = 25;
    friend.position.z = 375;
    you.position.x = 375;
    you.position.y = 25;
    you.position.z = 375;
    movePosition(data);
  }

  socket.on('init', function (data) {
    movePosition(data);
  });

  socket.on('x', function (data) {
    friend.position.x = data;
  });
  socket.on('y', function (data) {
    friend.position.y = data;
  });
  socket.on('z', function (data) {
    friend.position.z = data;
  });

  socket.on('moveTarget', function (data) {
    flashandMoveTarget(data);
  });

  function flashandMoveTarget(data) {
    //console.log(data);
    target.material.color.setHex(0xff8888);
    setTimeout(function () {
      target.material.color.setHex(0xff0000);
    }, 400);
    setTimeout(function () {
      target.material.color.setHex(0xff8888);
    }, 800);
    setTimeout(function () {
      target.material.color.setHex(0xff0000);
      taskManagerTarget.executeTasks(target, data);
    }, 1200);
  }

  function movePosition(data) {
    obstacles.forEach(function (ob, index) {
      ob.position.x = data.obs[index].x;
      ob.position.y = data.obs[index].y;
      ob.position.z = data.obs[index].z;
    });

    target.position.x = data.tar.x;
    target.position.y = data.tar.y;
    target.position.z = data.tar.z;
  }

  exports.iLose = false;
  socket.on('result', function (data) {
    document.getElementById('blackout').style.visibility = "visible";
    document.getElementById('resultResult').innerHTML = "(ಥ﹏ಥ)YOU LOSE";
    document.getElementById('unimportant').innerHTML = "beaten by a record of";
    document.getElementById('data').innerHTML = (data.totalTime + " with " + data.runTimes + " run times");
    document.getElementById('result').style.visibility = "visible";
    consoleLog.setValue("");
    youLose();
  });

  function youLose() {
    bothStop();
    exports.iLose = true;
    //alert("SORRY YOU LOSE... (ಥ﹏ಥ)");
  }

  exports.you = you;
  exports.target = target;
  exports.camera = camera;
  exports.isHit = isHit;
  exports.restart = restart;

})(this);