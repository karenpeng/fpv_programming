(function (exports) {
  //---------------------------------------------------------------
  //------------------------set up editor--------------------------
  //---------------------------------------------------------------
  var socket = io.connect('http://localhost');

  var Range = ace.require("ace/range").Range;
  var isRunning = false;

  var editor1 = ace.edit("editor1");
  editor1.setTheme("ace/theme/monokai");
  editor1.getSession().setMode("ace/mode/javascript");
  editor1.session.selection.moveCursorDown();
  editor1.on('focus', function () {
    document.getElementById('editor1').style.opacity = '0.9';
    document.getElementById('console').style.opacity = '0.9';
    document.getElementById('gap').style.opacity = '0.9';
  });

  socket.on('everybody is here', function () {
    console.log("i'm with you.( ˘ ³˘)♥");
    editor1.on("change", function () {
      //console.log(editor1.getValue());
      socket.emit('typing code', editor1.getValue());
    });
    socket.on('code', function (data) {
      editor2.setValue(data);
      editor2.focus();
    });
  });

  var editor2 = ace.edit("editor2");
  editor2.setTheme("ace/theme/monokai");
  editor2.getSession().setMode("ace/mode/javascript");
  editor2.setReadOnly(true);
  editor2.setOptions({
    highlightActiveLine: false,
    highlightGutterLine: false
  });
  editor2.renderer.$cursorLayer.element.style.opacity = 0;

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
    document.getElementById('editor1').style.height = (h - 150) + "px";
    document.getElementById('console').style.top = (h - 120) + "px";
  }
  window.addEventListener('resize', resize, false);

  //when run is clicked, parse the string input
  document.getElementById('run').onclick = function () {
    //console.log(editor1.getValue())
    //parse(editor1.getValue());
    if (!isRunning) {
      parse(editor1.session.doc.getAllLines());
      isRunning = true;
    }
    clockclockclock();
  };

  document.getElementById('reset').onclick = function () {
    editor1.setValue("");
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
    // console.log(endStr);

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

    try {
      //console.log(endStr);
      eval(endStr);
    } catch (err) {
      consoleLog.insert(err + '\n');
      console.log(err);
    }

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

    //if there's no tasks, no need to zoom the camera
    if (this.tasksNum > 0) {

      if (!this.tasks.length) {
        transit(false, function () {
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
      } else if (this.tasks.length === this.tasksNum) {
        transit(true, function () {
          var ta = that.tasks.shift();
          var direction = ta[0];
          var lineNum = ta[1];
          marker = editor1.session.addMarker(new Range(lineNum, 0, lineNum, 2000), 'highlight', 'fullLine', false);
          that.move(direction);
          editor1.setReadOnly(true);
          editor1.setOptions({
            highlightActiveLine: false,
            highlightGutterLine: false
          });
          editor1.renderer.$cursorLayer.element.style.opacity = 0;
          // document.getElementById('editor1').style.opacity = '0.7';
        });
      } else {
        var ta = this.tasks.shift();
        var direction = ta[0];
        var lineNum = ta[1];

        marker = editor1.session.addMarker(new Range(lineNum, 0, lineNum, 2000), 'highlight', 'fullLine', false);
        this.move(direction);
      }
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
    var that = this;

    for (var i = 0; i < 50 / UNIT + 1; i++) {

      if (i < 50 / UNIT) {
        setTimeout(function () {
          //if (!isHit()) {
          switch (direction) {
          case 'f':
            if (isHit(1) === null) {
              you.position.z -= UNIT;

            } else {
              if (!reported) {
                consoleLog.insert("( ﾟヮﾟ) hit " + isHit(1) + ".\n");
                reported = true;
              }
              you.position.z = z_copy;
            }
            break;
          case 'b':
            if (isHit(0) === null) {
              you.position.z += UNIT;
            } else {
              if (!reported) {
                consoleLog.insert("( ﾟヮﾟ) hit " + isHit(0) + ".\n");
                reported = true;
              }
              you.position.z = z_copy;
            }
            break;
          case 'r':
            if (isHit(2) === null) {
              you.position.x += UNIT;
            } else {
              if (!reported) {
                consoleLog.insert("( ﾟヮﾟ) hit " + isHit(2) + ".\n");
                reported = true;
              }
              you.position.x = x_copy;
            }
            break;
          case 'l':
            if (isHit(3) === null) {
              you.position.x -= UNIT;
            } else {
              if (!reported) {
                consoleLog.insert("( ﾟヮﾟ) hit " + isHit(3) + ".\n");
                reported = true;
              }
              you.position.x = x_copy;
            }
            break;
          case 'u':
            if (!isHit(4)) {
              you.position.y += UNIT;
            } else {
              if (!reported) {
                consoleLog.insert("( ﾟヮﾟ) hit " + isHit(4) + ".\n");
                reported = true;
              }
              you.position.y = y_copy;
            }
            break;
          case 'd':
            if (!isHit(5)) {
              you.position.y -= UNIT;
            } else {
              if (!reported) {
                consoleLog.insert("( ﾟヮﾟ) hit " + isHit(5) + ".\n");
                reported = true;
              }
              you.position.y = y_copy;
            }
            break;
          }
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

          }, i);
        } else {
          setTimeout(function () {

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

          }, j);
        } else {
          setTimeout(function () {
            you.idle = true;

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
    if (you.position.x === -475 && you.position.y === 25 && you.position.z === -475) {
      youWin();
    } else {
      backToSquareOne();
    }
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
        }, i);
      } else {
        setTimeout(function () {
          if (callback) {
            callback();
          }
          tryAgain();
        }, TIME_PERIOD + 300);
      }
    }
  }

  //-----------------------------------------------------------
  //-----------------------     you win     -------------------
  //-----------------------------------------------------------

  function youWin() {
    alert("ᕕ( ᐛ )ᕗ YOU WIN!!!");
  }

})(this);