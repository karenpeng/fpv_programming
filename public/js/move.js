(function (exports) {
  //----------------------------------------------------------------
  //------------------------ task manager --------------------------
  //----------------------------------------------------------------
  var taskManager = new TaskManager();
  var marker = null;

  function TaskManager() {
    this.tasks = [];
  }

  TaskManager.prototype.executeTasks = function (tasks) {
    this.tasks = tasks;
    this.tasksNum = tasks.length;
    this._execute();
  };

  TaskManager.prototype._execute = function () {
    //console.log(marker)
    if (marker) {
      editor1.session.removeMarker(marker);
      marker = null;
    }

    //only if there's task to complete
    if (this.tasksNum > 0) {

      // the last task
      if (!this.tasks.length) {
        transitCamera(false, function () {
          var isWin = result();
          if (realGame && isWin) {
            socket.emit('result', {
              'url': myURL,
              'data': true
            });
          }
          editor1.setReadOnly(false);
          editor1.setOptions({
            highlightActiveLine: true,
            highlightGutterLine: true
          });
          editor1.renderer.$cursorLayer.element.style.opacity = 1;
          isRunning = false;
        });
        return;

      } else {

        //the first task
        if (this.tasks.length === this.tasksNum) {
          var that = this;
          transitCamera(true, function () {
            var ta = that.tasks.shift();
            var direction = ta[0];
            var lineNum = ta[1];
            marker = editor1.session.addMarker(addMarkerRange(lineNum), 'highlight', 'fullLine', false);
            that.move(direction);
          });

        } else {
          var ta = this.tasks.shift();
          var direction = ta[0];
          var lineNum = ta[1];
          marker = editor1.session.addMarker(addMarkerRange(lineNum), 'highlight', 'fullLine', false);
          this.move(direction);
        }

        editor1.setReadOnly(true);
        editor1.setOptions({
          highlightActiveLine: false,
          highlightGutterLine: false
        });
        editor1.renderer.$cursorLayer.element.style.opacity = 0;
        // document.getElementById('editor1').style.opacity = '0.7';
      }

      //if there's no tasks, no need to zoom the camera
    } else {
      //nothing is running
      isRunning = false;
    }
  };

  //move one grid
  TaskManager.prototype.move = function (direction) {
    var x_copy = you.position.x;
    var y_copy = you.position.y;
    var z_copy = you.position.z;
    var reported = false;

    var UNIT = 0.25;

    var num = Math.round(Math.random() * 4) + 1;
    var sound = document.getElementById('um' + num);
    sound.play();

    for (var i = 0; i < 50 / UNIT + 1; i++) {

      if (i < 50 / UNIT) {
        setTimeout(function () {
          //if (!isHit()) {
          switch (direction) {
          case 'f':
            if (isHit(1) === null) {
              you.position.z -= UNIT;
              if (realGame) {
                socket.emit('z', {
                  'url': myURL,
                  'data': you.position.z
                });
              }
            } else {
              if (!reported) {
                consoleLog.insert("( ﾟヮﾟ) hit " + isHit(1) + ".\n");
                reported = true;
              }
              you.position.z = z_copy;
              if (realGame) {
                socket.emit('z', {
                  'url': myURL,
                  'data': you.position.z
                });
              }
            }
            break;
          case 'b':
            if (isHit(0) === null) {
              you.position.z += UNIT;
              if (realGame) {
                socket.emit('z', {
                  'url': myURL,
                  'data': you.position.z
                });
              }
            } else {
              if (!reported) {
                consoleLog.insert("( ﾟヮﾟ) hit " + isHit(0) + ".\n");
                reported = true;
              }
              you.position.z = z_copy;
              if (realGame) {
                socket.emit('z', {
                  'url': myURL,
                  'data': you.position.z
                });
              }
            }
            break;
          case 'r':
            if (isHit(2) === null) {
              you.position.x += UNIT;
              if (realGame) {
                socket.emit('x', {
                  'url': myURL,
                  'data': you.position.x
                });
              }
            } else {
              if (!reported) {
                consoleLog.insert("( ﾟヮﾟ) hit " + isHit(2) + ".\n");
                reported = true;
              }
              you.position.x = x_copy;
              if (realGame) {
                socket.emit('x', {
                  'url': myURL,
                  'data': you.position.x
                });
              }
            }
            break;
          case 'l':
            if (isHit(3) === null) {
              you.position.x -= UNIT;
              if (realGame) {
                socket.emit('x', {
                  'url': myURL,
                  'data': you.position.x
                });
              }
            } else {
              if (!reported) {
                consoleLog.insert("( ﾟヮﾟ) hit " + isHit(3) + ".\n");
                reported = true;
              }
              you.position.x = x_copy;
              if (realGame) {
                socket.emit('x', {
                  'url': myURL,
                  'data': you.position.x
                });
              }
            }
            break;
          case 'u':
            if (!isHit(4)) {
              you.position.y += UNIT;
              if (realGame) {
                socket.emit('y', {
                  'url': myURL,
                  'data': you.position.y
                });
              }
            } else {
              if (!reported) {
                consoleLog.insert("( ﾟヮﾟ) hit " + isHit(4) + ".\n");
                reported = true;
              }
              you.position.y = y_copy;
              if (realGame) {
                socket.emit('y', {
                  'url': myURL,
                  'data': you.position.y
                });
              }
            }
            break;
          case 'd':
            if (!isHit(5)) {
              you.position.y -= UNIT;
              if (realGame) {
                socket.emit('y', {
                  'url': myURL,
                  'data': you.position.y
                });
              }
            } else {
              if (!reported) {
                consoleLog.insert("( ﾟヮﾟ) hit " + isHit(5) + ".\n");
                reported = true;
              }
              you.position.y = y_copy;
              if (realGame) {
                socket.emit('y', {
                  'url': myURL,
                  'data': you.position.y
                });
              }
            }
            break;
          }
        }, i);

      } else {
        //moved one grid, execute the next task
        var that = this;
        setTimeout(function () {
          that._execute();
        }, 50 / UNIT + 1000);

      }
    }
  };

  //-----------------------------------------------------------
  //---------------------- move the camera --------------------
  //-----------------------------------------------------------

  function transitCamera(timeSpeed, callback) {
    var TIME_PERIOD = 400;
    var deltaX, deltaY, deltaZ;
    if (timeSpeed) {
      deltaX = camera.position.x - 50;
      deltaY = camera.position.y - 80;
      deltaZ = camera.position.z - 130;
      you.idle = false;
      you.add(camera);

    } else {
      deltaX = camera.position.x - 500;
      deltaY = camera.position.y - 800;
      deltaZ = camera.position.z - 1300;
      you.remove(camera);
    }

    for (var i = 0; i < TIME_PERIOD + 1; i++) {

      if (i < TIME_PERIOD) {
        setTimeout(function () {

          camera.position.x -= (deltaX / TIME_PERIOD);
          camera.position.y -= (deltaY / TIME_PERIOD);
          camera.position.z -= (deltaZ / TIME_PERIOD);

        }, i);
      } else {
        setTimeout(function () {

          if (callback) {
            callback();
          }
        }, TIME_PERIOD + 500);
      }
    }

  }

  //-----------------------------------------------------------
  //------------------------ run result -----------------------
  //-----------------------------------------------------------

  function result() {
    var gameResult = false;
    if (!iLose) {
      if (you.position.x === -475 && you.position.y === 25 && you.position.z === -475) {
        gameResult = true;
        youWin();
      } else {
        document.getElementById('nope').play();
        backToSquareOne();
        gameResult = false;
      }
    }
    return gameResult;
  }

  //-----------------------------------------------------------
  //-------------------- back to square one -------------------
  //-----------------------------------------------------------

  function backToSquareOne(callback) {
    //shakeHead();
    consoleLog.insert('Miss target. Back to square one. T-T\n');
    var deltaX = you.position.x - 475;
    var deltaY = you.position.y - 25;
    var deltaZ = you.position.z - 475;
    var TIME_PERIOD = 400;

    for (var i = 0; i < TIME_PERIOD + 1; i++) {
      if (i < TIME_PERIOD) {
        setTimeout(function () {
          you.position.x -= (deltaX / TIME_PERIOD);
          you.position.y -= (deltaY / TIME_PERIOD);
          you.position.z -= (deltaZ / TIME_PERIOD);
          if (realGame) {
            socket.emit('whole', {
              'url': myURL,
              'data': {
                "x": you.position.x,
                "y": you.position.y,
                "z": you.position.z
              }
            });
          }
        }, i);
      } else {
        setTimeout(function () {
          if (callback) {
            callback();
          }
          if (realGame) {
            tryAgain();
          }
        }, TIME_PERIOD + 300);
      }
    }
  }

  //-----------------------------------------------------------
  //-----------------------     you win     -------------------
  //-----------------------------------------------------------

  function youWin() {
    document.getElementById('yay').play();
    bothStop();
    alert("ᕕ( ᐛ )ᕗ YOU WIN!!!");
  }

  exports.taskManager = taskManager;

})(this);