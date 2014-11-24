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
      color: 0xffffff,
      opacity: 0.1,
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

    plane = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
      color: 0xffffff,
      map: THREE.ImageUtils.loadTexture("img/test_ground.jpg")
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
    geometry = new THREE.PlaneBufferGeometry(1000, 500);
    var backWall = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
      color: 0xffffff
    }));
    backWall.name = "backBounce";
    backWall.position.z = -500;
    backWall.position.y = 250;
    backWall.visible = false;
    scene.add(backWall);
    objects.push(backWall);

    //left wall
    geometry = new THREE.PlaneBufferGeometry(1000, 500);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI / 2));
    var leftWall = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
      color: 0xffffff
    }));
    leftWall.name = "leftBounce";
    leftWall.position.x = -500;
    leftWall.position.y = 250;
    leftWall.visible = false;
    scene.add(leftWall);
    objects.push(leftWall);

    //right wall
    geometry = new THREE.PlaneBufferGeometry(1000, 500);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationY(-Math.PI / 2));
    var rightWall = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
      color: 0xffffff
    }));
    rightWall.name = "rightBounce";
    rightWall.position.x = 500;
    rightWall.position.y = 250;
    rightWall.visible = false;
    scene.add(rightWall);
    objects.push(rightWall);

    //front wall
    geometry = new THREE.PlaneBufferGeometry(1000, 500);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI));
    var frontWall = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
      color: 0xffffff
    }));
    frontWall.name = "frontBounce";
    frontWall.position.y = 250;
    frontWall.position.z = 500;
    frontWall.visible = false;
    scene.add(frontWall);
    objects.push(frontWall);

    //target
    material = new THREE.MeshLambertMaterial({
      color: 0xff0000
    });
    target = new THREE.Mesh(cubeGeo, material);
    target.position.x = -475;
    target.position.y = 50;
    target.position.z = -475;
    target.name = "target";
    scene.add(target);
    //objects.push(target);

    //you
    // loader = new THREE.JSONLoader();
    // you = new Guy();
    // you.loadThings();
    material = new THREE.MeshLambertMaterial({
      color: 0xffff00
    });
    you = new THREE.Mesh(cubeGeo, material);
    you.position.x = 475;
    // you.position.y = 56;
    you.position.y = 25;
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

      if (x === -475 && z === -475 && y < 150) {} else {
        if (x === -475 && y === 25 & z === 475) {} else {
          mesh = new THREE.Mesh(cubeGeo, new THREE.MeshLambertMaterial({
            color: 0xffffff,
            //shading: THREE.FlatShading,
            // map: THREE.ImageUtils.loadTexture("img/sheep" + Math.round(Math.random()) + ".png")
            map: THREE.ImageUtils.loadTexture("img/meow.jpg")
          }));
          mesh.position.x = x;
          mesh.position.y = y;
          mesh.position.z = z;
          mesh.name = "cat";
          scene.add(mesh);
          objects.push(mesh);
        }
      }

      if (Math.random() > 0.5) {
        upMesh = mesh.clone();
        upMesh.position.y = 75;
        // if (Math.random() > 0.5) {
        //    upMesh.position.x += 50;
        // }
        upMesh.name = "cat";
        scene.add(upMesh);
        objects.push(upMesh);

      }

    }

    // //for testing
    // var c = new THREE.Mesh(cubeGeo, cubeMaterial);
    // c.position.x = 425;
    // c.position.y = 25;
    // c.position.z = 475;
    // c.name = "obstacle";
    // scene.add(c);
    // objects.push(c);

    // Lights

    var ambientLight = new THREE.AmbientLight(0x666666);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 0.75, 0.5).normalize();
    scene.add(directionalLight);

    renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setClearColor(0xfafafa);
    //renderer.setClearColor(0x2cc8ff);
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);

    //STATS
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

  function isHit(_index) {

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

    raycaster.ray.set(you.position, rays[_index]);

    var intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0 && intersects[0].distance < 25) {

      //console.log(intersects[0].object.name + " " + intersects[0].distance);
      return intersects[0].object.name;

    } else return null;

  }

  function animate() {
    requestAnimationFrame(animate);

    if (frameRate % 2 === 0) {
      render();
    }

    frameRate++;
    var now = new Date().getTime();
    target.position.y = Math.sin(now * 0.002) * 20 + 45;
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

  function restart() {

    //oh no how could i dispose things...
    //init();
  }

  exports.you = you;
  exports.camera = camera;
  exports.isHit = isHit;
  exports.restart = restart;

})(this);