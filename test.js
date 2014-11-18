function Cube() {
  this.commands = [];
}

Cube.prototype.executeCommand = function (commands, callback) {
  this.commands = commands;
  this.commandCallback = callback;
  this._execute();
};

Cube.prototype._execute = function () {
  if (!this.commands.length) {
    console.log('Commands all executed');

    // executed the callback if exist
    if (this.commandCallback) {
      this.commandCallback();
      this.commandCallback = null;
    }
    return;
  }

  var cmd = this.commands.shift();
  console.log('\nget command %s, start execute', cmd);
  switch (cmd) {
  case 'f':
    this.forward();
    break;
  case 'b':
    this.backward();
    break;
  case 'r':
    this.right();
    break;
  case 'l':
    this.left();
    break;
  default:
    console.log('unkown command %s', cmd);
  }
};

Cube.prototype.forward = function () {
  console.log('forward start');
  var start = Date.now();
  var self = this;
  // mock animate
  setTimeout(function () {
    console.log('forward done, used %s ms', Date.now() - start);
    // execute the next command
    self._execute();
  }, 1000);
};

Cube.prototype.backward = function () {
  console.log('backward start');
  var start = Date.now();
  var self = this;
  // mock animate
  setTimeout(function () {
    console.log('backward done, used %s ms', Date.now() - start);
    // execute the next command
    self._execute();
  }, 1000);
};

Cube.prototype.right = function () {
  console.log('right start');
  var start = Date.now();
  var self = this;
  // mock animate
  setTimeout(function () {
    console.log('right done, used %s ms', Date.now() - start);
    // execute the next command
    self._execute();
  }, 1000);
};

Cube.prototype.left = function () {
  console.log('left start');
  var start = Date.now();
  var self = this;
  // mock animate
  setTimeout(function () {
    console.log('left done, used %s ms', Date.now() - start);
    // execute the next command
    self._execute();
  }, 1000);
};

var cube = new Cube();
cube.executeCommand(['f', 'f', 'b', 'r', 'r', 'l'], function () {
  console.log('executed callback');
});