(function (exports) {
  //----------------------------------------------------------------
  //------------------------ task manager --------------------------
  //----------------------------------------------------------------
  var taskManager = new TaskManager();
  var taskManagerTarget = new TaskManager();
  var marker = null;

  function TaskManager() {
    this.tasks = [];
  }

  TaskManager.prototype.executeTasks = function (obj, tasks, editor) {
    this.obj = obj;
    this.tasks = tasks;
    this.tasksNum = tasks.length;
    if (!editor) {
      this._execute();
    } else {
      this._execute(editor);
    }
  };

  TaskManager.prototype._execute = function (editor) {
    //console.log(marker)
    if (!editor) {
      if (this.tasksNum > 0) {
        var tas = this.tasks.shift();
        this.simpleMove(target, tas);
      }
      return;
    }

    if (marker) {
      editor1.session.removeMarker(marker);
      marker = null;
    }

    //only if there's task to complete
    if (this.tasksNum > 0) {

      // the last task
      if (!this.tasks.length) {
        transitCamera(false, function () {
          result();
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
            that.move(that.obj, direction);
          });

        } else {
          var ta = this.tasks.shift();
          var direction = ta[0];
          var lineNum = ta[1];
          marker = editor1.session.addMarker(addMarkerRange(lineNum), 'highlight', 'fullLine', false);
          this.move(this.obj, direction);
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
  TaskManager.prototype.simpleMove = function (obj, direction) {

    var UNIT = 0.4;

    for (var i = 0; i < 50 / UNIT + 1; i++) {

      if (i < 50 / UNIT) {
        setTimeout(function () {
          //if (!isHit()) {
          switch (direction) {
          case 'f':
            if (isHit(obj.position, 1) === null) {
              obj.position.z -= UNIT;
            }
            break;
          case 'b':
            if (isHit(obj.position, 0) === null) {
              obj.position.z += UNIT;
            }
            break;
          case 'r':
            if (isHit(obj.position, 2) === null) {
              obj.position.x += UNIT;
            }
            break;
          case 'l':
            if (isHit(obj.position, 3) === null) {
              obj.position.x -= UNIT;
            }
            break;
          case 'u':
            if (!isHit(obj.position, 4)) {
              obj.position.y += UNIT;
            }
            break;
          case 'd':
            if (!isHit(obj.position, 5)) {
              obj.position.y -= UNIT;
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

  TaskManager.prototype.move = function (obj, direction) {

    var reported = false;

    var UNIT = 0.36;

    var num = Math.round(Math.random() * 4) + 1;
    var sound = document.getElementById('um' + num);
    sound.play();

    for (var i = 0; i < 50 / UNIT + 1; i++) {

      if (i < 50 / UNIT) {
        setTimeout(function () {

          switch (direction) {
          case 'f':
            if (isHit(obj.position, 1) === null) {
              obj.position.z -= UNIT;
              if (realGame) {
                socket.emit('z', {
                  'url': myURL,
                  'data': you.position.z
                });
              }
            } else {
              if (!reported) {
                consoleLog.insert("( ﾟヮﾟ) hit " + isHit(obj.position, 1) + ".\n");
                reported = true;
              }
              if (realGame) {
                socket.emit('z', {
                  'url': myURL,
                  'data': you.position.z
                });
              }
            }
            break;
          case 'b':
            if (isHit(obj.position, 0) === null) {
              obj.position.z += UNIT;
              if (realGame) {
                socket.emit('z', {
                  'url': myURL,
                  'data': you.position.z
                });
              }
            } else {
              if (!reported) {
                consoleLog.insert("( ﾟヮﾟ) hit " + isHit(obj.position, 0) + ".\n");
                reported = true;
              }
              if (realGame) {
                socket.emit('z', {
                  'url': myURL,
                  'data': you.position.z
                });
              }
            }
            break;
          case 'r':
            if (isHit(obj.position, 2) === null) {
              obj.position.x += UNIT;
              if (realGame) {
                socket.emit('x', {
                  'url': myURL,
                  'data': you.position.x
                });
              }
            } else {
              if (!reported) {
                consoleLog.insert("( ﾟヮﾟ) hit " + isHit(obj.position, 2) + ".\n");
                reported = true;
              }
              if (realGame) {
                socket.emit('x', {
                  'url': myURL,
                  'data': you.position.x
                });
              }
            }
            break;
          case 'l':
            if (isHit(obj.position, 3) === null) {
              obj.position.x -= UNIT;
              if (realGame) {
                socket.emit('x', {
                  'url': myURL,
                  'data': you.position.x
                });
              }
            } else {
              if (!reported) {
                consoleLog.insert("( ﾟヮﾟ) hit " + isHit(obj.position, 3) + ".\n");
                reported = true;
              }
              if (realGame) {
                socket.emit('x', {
                  'url': myURL,
                  'data': you.position.x
                });
              }
            }
            break;
          case 'u':
            if (!isHit(obj.position, 4)) {
              obj.position.y += UNIT;
              if (realGame) {
                socket.emit('y', {
                  'url': myURL,
                  'data': you.position.y
                });
              }
            } else {
              if (!reported) {
                consoleLog.insert("( ﾟヮﾟ) hit " + isHit(obj.position, 4) + ".\n");
                reported = true;
              }
              if (realGame) {
                socket.emit('y', {
                  'url': myURL,
                  'data': you.position.y
                });
              }
            }
            break;
          case 'd':
            if (!isHit(obj.position, 5)) {
              obj.position.y -= UNIT;
              if (realGame) {
                socket.emit('y', {
                  'url': myURL,
                  'data': you.position.y
                });
              }
            } else {
              if (!reported) {
                consoleLog.insert("( ﾟヮﾟ) hit " + isHit(obj.position, 5) + ".\n");
                reported = true;
              }
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
          that._execute(true);
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

      deltaX = camera.position.x - 100;
      deltaY = camera.position.y - 160;
      deltaZ = camera.position.z - 200;
      you.idle = false;
      you.add(camera);

    } else {

      deltaX = camera.position.x - 500;
      deltaY = camera.position.y - 800;
      deltaZ = camera.position.z - 1000;
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
    if (!iLose) {
      if (you.position.x < target.position.x + 1 && you.position.x > target.position.x - 1 &&
        you.position.y < target.position.y + 50 && you.position.y > target.position.y - 50 &&
        you.position.z < target.position.z + 1 && you.position.z > target.position.z - 1) {
        youWin();
      } else {
        document.getElementById('nope').play();
        if (realGame) {
          tryAgain();
        }
      }
    }
  }

  //-----------------------------------------------------------
  //-----------------------     you win     -------------------
  //-----------------------------------------------------------

  function youWin() {
    document.getElementById('yay').play();
    if (realGame) {
      bothStop();
      socket.emit('result', {
        'url': myURL,
        'data': {
          'codingTime': document.getElementById('timer1').innerHTML,
          'runningTime': document.getElementById('timer2').innerHTML
        }
      });
    }
    alert("ᕕ( ᐛ )ᕗ YOU WIN!!!");
  }

  exports.taskManager = taskManager;
  exports.taskManagerTarget = taskManagerTarget;

})(this);