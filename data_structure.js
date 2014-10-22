function myStack(number, x, y, z) {
  this.stackBoxes = [];
  this.init(number, x, y, z);
  this.isPop = false;
  this.isPush = false;
}

myStack.prototype.init = function (number, x, y, z) {
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
  for (i = 0; i < number; i++) {
    var stackBox = new Box(colors[colorIndex]);
    colorIndex++;
    if (colorIndex > colors.length) {
      colorIndex = 0;
    }
    stackBox.mesh.position.y = i * 50 - 100;
    this.stackBoxes.push(stackBox);
  }
  var geometry = new THREE.BoxGeometry(100, number * 50 + 100, 100);
  this.gianBox = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
    color: 0xffffff,
    opacity: 0.4,
    transparent: true
  }));
  //gianBox.visible = false;
  this.gianBox.position.x = x;
  this.gianBox.position.y = 50 + y;
  this.gianBox.position.z = z;
  var that = this;
  this.stackBoxes.forEach(function (box) {
    that.gianBox.add(box.mesh);
  });
  scene.add(this.gianBox);
};

myStack.prototype.push = function (time) {
  //this.stackCylinders[0]
  //this.stackCylinders.push(something);

};

myStack.prototype.pop = function () {
  if (this.isPop) {
    if (this.stackBoxes[this.stackBoxes.length - 1].mesh.position.y < 400) {
      this.stackBoxes[this.stackBoxes.length - 1].mesh.position.y++;
    } else {
      this.stackBoxes.splice(this.stackBoxes.length - 1, 0);
      this.isPop = false;
    }
    //this.stackCylinders[0]
    // return this.stackCylinders[0];
  }
};

function Box(_color) {
  var geometry = new THREE.BoxGeometry(50, 50, 50);
  var material = new THREE.MeshLambertMaterial({
    color: _color
  });
  this.mesh = new THREE.Mesh(geometry, material);
  scene.add(this.mesh);
}