function Guy() {
  this.geometry = null;
  this.material = null;
  this.mesh = null;
  this.loaded = false;
  this.currentDirection = 'f';
  this.moveCount = 0;
  this.copyPosition = {
    'x': null,
    'y': null,
    'z': null
  };

  this.loadThings = function () {
    var that = this;
    loader.load("model/guy.js", function (geometry1) {
      that.geometry = geometry1;
      that.material = new THREE.MeshLambertMaterial({
        color: 0x0000bb
      });
      that.mesh = new THREE.Mesh(that.geometry, that.material);
      that.mesh.scale.set(12, 12, 12);
      that.mesh.position.x = 475;
      that.mesh.position.y = -12;
      that.mesh.position.z = 475;
      that.loaded = true;
      scene.add(that.mesh);
      objects.push(that.mesh);
    });
  };
}
Guy.prototype.walk = function (theta) {
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
Guy.prototype.forward = function () {
  this.turn('f');
  if (this.moveCount === 0) {
    this.copyPosition.z = this.mesh.position.z;
    this.moveCount++;
  }
  while (this.copyPosition.z - this.mesh.position.z < 50) {
    this.mesh.position.z -= 0.000001;
  }
  this.moveCount = 0;
  this.currentDirection = 'f';
};
Guy.prototype.backward = function () {
  this.turn('f');
  if (this.moveCount === 0) {
    this.copyPosition.z = this.mesh.position.z;
    this.moveCount++;
  }
  while (this.mesh.position.z - this.copyPosition.z < 50) {
    this.mesh.position.z += 0.01;
  }
  this.moveCount = 0;
};
Guy.prototype.left = function () {
  this.turn('l');
  if (this.moveCount === 0) {
    this.copyPosition.x = this.mesh.position.x;
    this.moveCount++;
  }
  while (this.copyPosition.x - this.mesh.position.x < 50) {
    this.mesh.position.x -= 0.01;
  }
  this.moveCount = 0;
};
Guy.prototype.right = function () {
  this.turn('l');
  if (this.moveCount === 0) {
    this.copyPosition.x = this.mesh.position.x;
    this.moveCount++;
  }
  while (this.mesh.position.x - this.copyPosition.x < 50) {
    this.mesh.position.x += 0.01;
  }
  this.moveCount = 0;
};
Guy.prototype.turn = function (direction) {
  switch (direction) {
  case 'f':
    if (this.currentDirection !== 'f') {
      //console.log(this.mesh);
      this.mesh.rotation.y += Math.PI / 2;
      this.currentDirection = 'f';
    }
    break;
  case 'l':
    if (this.currentDirection !== 'l') {
      //console.log(this.mesh);
      this.mesh.rotation.y += Math.PI / 2;
      this.currentDirection = 'l';
    }
    break;
  case 'u':
    if (this.currentDirection !== 'u') {
      //console.log(this.mesh);
      this.mesh.rotation.y += Math.PI / 2;
      this.currentDirection = 'u';
    }
    break;
  }
};
//}