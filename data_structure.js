function Stack(number) {
  this.stackCylinders = [];
  this.geometry = new THREE.CylinderGeometry(10, 10, 6, 32);
  this.material = new THREE.MeshPhongMaterial({
    color: 0xffffff
  });
  this.init(number);
}

Stack.prototype.init = function (number) {
  for (i = 0; i < number; i++) {
    stackCylinder = new THREE.Mesh(this.geometry, this.material);
    stackCylinder.position.x = 60;
    stackCylinder.position.z = 60;
    //stackCylinder.index
    stackCylinder.position.y = i * 8 - 3;
    stackCylinder.whatever = Math.random();
    this.stackCylinders.push(stackCylinder);
    scene.add(queCylinder);
  }
  console.log(stackCylinder);
};

Stack.prototype.push = function (something) {
  //this.stackCylinders[0]
  this.stackCylinders.push(something);
};

Stack.prototype.pop = function () {
  //this.stackCylinders[0]
  return this.stackCylinders[0];
};

function Node(mGeometry) {
  //this.geometry = new THREE.mGeometry(20,20,20);
}

Node.prototype.init = function () {

}