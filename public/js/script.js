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
    camera.position.set(500, 1000, 1300);
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

    //target
    material = new THREE.MeshLambertMaterial({
      color: 0xff0000
    });
    target = new THREE.Mesh(cubeGeo, material);
    target.position.x = -375;
    target.position.y = 25;
    target.position.z = -375;
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
    you.position.x = 375;
    // you.position.y = 56;
    you.position.y = 25;
    you.position.z = 375;
    you.idle = true;
    you.direction = 'front';
    scene.add(you);
    //objects.push(you);

    //obstacles
    obstacleMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      //shading: THREE.FlatShading,
      // map: THREE.ImageUtils.loadTexture("img/sheep" + Math.round(Math.random()) + ".png")
      map: THREE.ImageUtils.loadTexture("img/meow.jpg")
    });

    if (info === undefined) {
      console.log("wat");

      for (j = 0; j < 30; j++) {
        var x = -375 + Math.floor(Math.pow(Math.random(), 2) * 16) * 50;
        //var y = 25 * (j % 2 + 1);
        //var y = 25;
        var y;
        if (Math.random() > 0.7) {
          y = 25 + Math.floor(Math.random() * 6) * 50;
        } else if (Math.random() > 0.4) {
          y = 25;
        } else {
          y = 75;
        }
        var z = -375 + Math.floor(Math.pow(Math.random(), 2) * 16) * 50;

        if (x === -375 && z === -375 && y < 150) {} else {
          if (x === -375 && y === 25 && z === 375) {} else {
            obstacles[j] = new THREE.Mesh(cubeGeo, obstacleMaterial);
            obstacles[j].position.x = x;
            obstacles[j].position.y = y;
            obstacles[j].position.z = z;
            obstacles[j].name = "cat";
            //obstacles.push(obstacle);
            scene.add(obstacles[j]);
            objects.push(obstacles[j]);
          }
        }

        // if (Math.random() > 0.5 && obstacles[j]) {
        //   va++;
        //   obstacles[19 + va] = obstacles[j].clone();
        //   obstacles[19 + va].position.y = 75;
        //   if (Math.random() > 0.5) {
        //     obstacles[19 + va].position.x += 50;
        //   }
        //   obstacles[19 + va].name = "cat";
        //   //obstacles.push(obstacle);
        //   scene.add(obstacles[19 + va]);
        //   objects.push(obstacles[19 + va]);
        // }

      }

    } else {

      obstacles.forEach(function (ob, index) {
        if (info[index] !== undefined) {
          ob.position.x = info[index].x;
          ob.position.y = info[index].y;
          ob.position.z = info[index].z;
        }
        //obstacles.push(inf);

      });

      if (info.length > obstacles.length) {
        var less = info.length - obstacles.length;
        for (var i = 0; i < less; i++) {
          obstacles[i] = new THREE.Mesh(cubeGeo, obstacleMaterial);
          obstacles[i].position.x = info.x;
          obstacles[i].position.y = info.y;
          obstacles[i].position.z = info.z;
          obstacles[i].name = "cat";
          //obstacles.push(obstacle);
          scene.add(obstacles[i]);
          objects.push(obstacles[i]);
        }
      } else {
        var more = obstacles.length - info.length;
        for (var i = obstacles.length; i < more; i++) {
          scene.remove(obstacles[i]);
          obstacles[i].forEach(function (obj) {
            if (obj instanceof THREE.Mesh) {
              obj.geometry.dispose();
              obj.material.dispose();
            }
            obj = null;
          });
        }
      }
    }

    // obstacles.forEach(function (o) {
    //   obstacle = new THREE.Mesh(cubeGeo, obstacleMaterial);
    //   obstacle.position.x = o.x;
    //   obstacle.position.y = o.y;
    //   obstacle.position.z = o.z;
    //   obstacle.name = "cat";
    //   obstacles.push(obstacle);
    //   scene.add(obstacle);
    //   objects.push(obstacle);
    // });
    //
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
    renderer.setClearColor(0xfafaff);
    //renderer.setClearColor(0x2cc8ff);
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);

    //STATS
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.left = '0px';
    //document.body.appendChild(stats.domElement);

    window.addEventListener('resize', onWindowResize, false);

    render();

  }

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    controls.handleResize();
    renderer.setSize(window.innerWidth, window.innerHeight);

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

    var choices = ['d', 'l', 'f', 'r', 'b', 'u'];

    if (frameRate % 1800 === 0 && frameRate !== 0 && !realGame && level > 3) {
      var steps = Math.round(Math.random() * 3) + 1;
      var instructions = [];
      for (var i = 0; i < steps; i++) {
        instructions.push(choices[Math.round(Math.random() * 5)]);
      }
      target.material.color.setHex(0xff8888);
      setTimeout(function () {
        target.material.color.setHex(0xff0000);
      }, 400);
      setTimeout(function () {
        target.material.color.setHex(0xff8888);
      }, 800);
      setTimeout(function () {
        target.material.color.setHex(0xff0000);
        taskManagerTarget.executeTasks(target, instructions);
      }, 1200);
    }

    frameRate++;

    stats.update();
    controls.update();
  }

  function render() {

    renderer.render(scene, camera);

  }

  THREE.Object3D.prototype.clear = function () {
    if (this instanceof THREE.Mesh) {
      this.geometry.dispose();
      this.material.dispose();
      //this = null;
    }
    var children = this.children;
    for (var i = children.length - 1; i >= 0; i--) {
      var child = children[i];
      child.clear();

      child = null;
    }
    //this = null;
  };

  function restart(data) {
    // scene.clear();
    // init(data);
    //friend = you.clone();
    material = new THREE.MeshLambertMaterial({
      color: 0x00ff00
    });
    friend = new THREE.Mesh(cubeGeo, material);
    friend.position.x = 375;
    // you.position.y = 56;
    friend.position.y = 25;
    friend.position.z = 375;
    scene.remove(you);
    scene.add(friend);
    scene.add(you);
    movePosition(data);
  }

  socket.on('x', function (data) {
    friend.position.x = data;
    //console.log('z' + data);
  });
  socket.on('y', function (data) {
    friend.position.y = data;
    //console.log('z' + data);
  });
  socket.on('z', function (data) {
    friend.position.z = data;
    //console.log('z' + data);
  });

  socket.on('moveTarget', function (data) {
    console.log(data);
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
  });

  function movePosition(info) {
    obstacles.forEach(function (ob, index) {
      if (info[index] !== undefined) {
        ob.position.x = info[index].x;
        ob.position.y = info[index].y;
        ob.position.z = info[index].z;
      }
      //obstacles.push(inf);
    });
    // if (info.length > obstacles.length) {
    //   var less = info.length - obstacles.length;
    //   for (var i = obstacles.length; i < obstacles.length + less; i++) {
    //     obstacles[i] = new THREE.Mesh(cubeGeo, obstacleMaterial);
    //     obstacles[i].position.x = info.x;
    //     obstacles[i].position.y = info.y;
    //     obstacles[i].position.z = info.z;
    //     obstacles[i].name = "cat";
    //     //obstacles.push(obstacle);
    //     scene.add(obstacles[i]);
    //     objects.push(obstacles[i]);
    //   }
    // } else {
    //   var more = obstacles.length - info.length;
    //   for (var i = obstacles.length; i >= obstacles.length - more; i--) {
    //     scene.remove(obstacles[i]);
    //     // obstacles[i].geometry.dispose();
    //     // obstacles[i].material.dispose();
    //     // obstacles[i] = null;
    //   }
    // }
  }

  exports.iLose = false;
  socket.on('result', function (data) {
    if (data) {
      youLose();
    }
  });

  function youLose() {
    bothStop();
    exports.iLose = true;
    alert("SORRY YOU LOSE... (ಥ﹏ಥ)");
  }

  exports.you = you;
  exports.camera = camera;
  exports.isHit = isHit;
  exports.restart = restart;
  exports.target = target;

})(this);