(function (exports) {
  //---------------------------------------------------------------
  //------------------------set up editor--------------------------
  //---------------------------------------------------------------
  var Range = ace.require("ace/range").Range;

  var editor1 = ace.edit("editor1");
  editor1.setTheme("ace/theme/monokai");
  editor1.getSession().setMode("ace/mode/javascript");

  // var editor2 = ace.edit("editor2");
  // editor2.setTheme("ace/theme/monokai");
  // editor2.getSession().setMode("ace/mode/javascript");

  //get elementsssss

  var consoleLog = ace.edit("console");
  consoleLog.setReadOnly(true);
  consoleLog.setOptions({
    highlightActiveLine: false,
    highlightGutterLine: false
  });
  consoleLog.renderer.$cursorLayer.element.style.opacity = 0;
  resize();

  function resize() {
    var h = window.innerHeight;
    document.getElementById('editor1').style.height = (h - 120) + "px";
    document.getElementById('console').style.top = (h - 120) + "px";
  }
  window.addEventListener('resize', resize, false);

  //when run is clicked, parse the string input
  document.getElementById('run').onclick = function evaluate() {
    //console.log(editor1.getValue())
    //parse(editor1.getValue());
    parse(editor1.session.doc.getAllLines());
  };

  var canvas = document.getElementsByTagName("CANVAS")[0];
  canvas.onmousedown = function () {
    canvas.style.cursor = "url('img/grabbing.png'), default";
  };

  canvas.onmouseover = function () {
    canvas.style.cursor = "url('img/grab.png'), default";
  };

  canvas.onmouseup = function () {
    canvas.style.cursor = "url('img/grab.png'), default";
  };

  //---------------------------------------------------------------
  //------------------------    parse    --------------------------
  //---------------------------------------------------------------
  var tasks = [];

  function parse(strArray) {
    var endStr = "";
    strArray.forEach(function (str, index) {
      endStr += (replace(str, index));
    });
    //console.log(endStr);

    function replace(str, index) {
      var postStr = str;
      postStr = postStr.replace(/forward\(\)/, "tasks.push(['f'," + index + "])");
      postStr = postStr.replace(/backward\(\)/, "tasks.push(['b'," + index + "])");
      postStr = postStr.replace(/left\(\)/, "tasks.push(['l'," + index + "])");
      postStr = postStr.replace(/right\(\)/, "tasks.push(['r'," + index + "])");
      postStr = postStr.replace(/up\(\)/, "tasks.push(['u'," + index + "])");
      postStr = postStr.replace(/down\(\)/, "tasks.push(['d'," + index + "])");
      //making it as separate line again
      postStr += '\n';
      return postStr;
    }

    //console.log(postStr);
    try {
      //console.log(endStr);
      eval(endStr);
    } catch (err) {
      consoleLog.insert(err + '\n');
      console.log(err);
    }
    //console.log(tasks + " " + tasks.length);
    //console.log(tasks);
    try {
      taskManager.executeTasks(tasks);
    } catch (err) {
      consoleLog.insert(err + '\n');
      console.log(err);
    }
  }

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
    var that = this;
    //console.log(marker)
    if (marker) {
      editor1.session.removeMarker(marker);
      marker = null;
    }
    if (!this.tasks.length) {
      transit(false, result);
      return;
    } else if (this.tasks.length === this.tasksNum) {
      transit(true, function () {
        var ta = that.tasks.shift();
        var direction = ta[0];
        var lineNum = ta[1];
        marker = editor1.session.addMarker(new Range(lineNum, 0, lineNum, 2000), 'highlight', 'fullLine', false);
        that.move(direction);
      });
    } else {
      var ta = this.tasks.shift();
      var direction = ta[0];
      var lineNum = ta[1];
      console.log(lineNum);
      marker = editor1.session.addMarker(new Range(lineNum, 0, lineNum, 2000), 'highlight', 'fullLine', false);
      this.move(direction);
    }
  };

  //move one grid
  TaskManager.prototype.move = function (direction) {
    var x_copy = you.position.x;
    var y_copy = you.position.y;
    var z_copy = you.position.z;

    var UNIT = 0.25;
    var that = this;

    for (var i = 0; i < 50 / UNIT + 1; i++) {

      if (i < 50 / UNIT) {

        setTimeout(function () {
          //if (!isHit()) {
          switch (direction) {
          case 'f':
            if (!isHit(1)) {
              you.position.z -= UNIT;
            } else {
              you.position.z = z_copy;
            }
            break;
          case 'b':
            if (!isHit(0)) {
              you.position.z += UNIT;
            } else {
              you.position.z = z_copy;
            }
            break;
          case 'r':
            if (!isHit(2)) {
              you.position.x += UNIT;
            } else {
              you.position.x = x_copy;
            }
            break;
          case 'l':
            //var ray = isHit();
            if (!isHit(3)) {
              you.position.x -= UNIT;
            } else {
              //you.position.x += UNIT;
              you.position.x = x_copy;
            }
            break;
          case 'u':
            if (!isHit(4)) {
              you.position.y += UNIT;
            } else {
              you.position.y = y_copy;
            }
            break;
          case 'd':
            if (!isHit(5)) {
              you.position.y -= UNIT;
            } else {
              you.position.y = y_copy;
            }
            break;
          }
          //render();
          //}

        }, i);

      } else {
        setTimeout(function () {
          that._execute();
        }, 50 / UNIT + 1000);
      }
    }
  };

  //-----------------------------------------------------------
  //---------------------- move the camera --------------------
  //-----------------------------------------------------------

  function transit(timeSpeed, callback) {
    var deltaX = 500 - 50;
    var deltaY = 800 - 80;
    var deltaZ = 1300 - 130;
    var TIME_PERIOD = 600;

    if (timeSpeed) {
      you.idle = false;
      you.add(camera);
      for (var i = 0; i < TIME_PERIOD + 1; i++) {

        if (i < TIME_PERIOD) {
          setTimeout(function () {

            camera.position.x -= (deltaX / TIME_PERIOD);
            camera.position.y -= (deltaY / TIME_PERIOD);
            camera.position.z -= (deltaZ / TIME_PERIOD);
            //render();
          }, i);
        } else {
          setTimeout(function () {
            //you.add(camera);
            if (callback) {
              callback();
            }
          }, TIME_PERIOD + 500);
        }
      }

    } else {
      you.remove(camera);
      for (var j = 0; j < TIME_PERIOD + 1; j++) {

        if (j < TIME_PERIOD) {
          setTimeout(function () {

            camera.position.x += (deltaX / TIME_PERIOD);
            camera.position.y += (deltaY / TIME_PERIOD);
            camera.position.z += (deltaZ / TIME_PERIOD);
            //render();
          }, j);
        } else {
          setTimeout(function () {
            you.idle = true;
            //you.remove(camera);
            if (callback) {
              callback();
            }
          }, TIME_PERIOD + 500);
        }
      }
    }
  }

  //-----------------------------------------------------------
  //------------------------ run result -----------------------
  //-----------------------------------------------------------
  function result() {
    if (you.position === new THREE.Vector3(-475, 40, -475)) {
      youWin();
    } else {
      backToSquareOne();
    }
  }

  //-----------------------------------------------------------
  //-------------------- back to square one -------------------
  //-----------------------------------------------------------
  function backToSquareOne(callback) {
    //shakehand();
    console.log('back to square one');
    var deltaX = you.position.x - 475;
    var deltaY = you.position.y - 25;
    var deltaZ = you.position.z - 475;
    var TIME_PERIOD = 400;

    // for (var i = 0; i < TIME_PERIOD + 61; i++) {
    //   if (i < TIME_PERIOD + 60) {
    //     setTimeout(function () {
    //       if (i > 70) {
    //         you.position.x -= (deltaX / TIME_PERIOD);
    //         you.position.y -= (deltaY / TIME_PERIOD);
    //         you.position.z -= (deltaZ / TIME_PERIOD);
    //       }
    //     }, i);
    //   } else {
    //     setTimeout(function () {
    //       if (callback) {
    //         callback();
    //       }
    //     }, TIME_PERIOD + 600);
    //   }
    // }
    for (var i = 0; i < TIME_PERIOD + 1; i++) {
      if (i < TIME_PERIOD) {
        setTimeout(function () {
          you.position.x -= (deltaX / TIME_PERIOD);
          you.position.y -= (deltaY / TIME_PERIOD);
          you.position.z -= (deltaZ / TIME_PERIOD);
        }, i);
      } else {
        setTimeout(function () {
          if (callback) {
            callback();
          }
        }, TIME_PERIOD + 300);
      }
    }
  }

  //-----------------------------------------------------------
  //-----------------------     you win     -------------------
  //-----------------------------------------------------------
  function youWin() {
    alert("yay!");
  }

})(this);