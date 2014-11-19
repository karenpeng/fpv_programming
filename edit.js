(function (exports) {
  //---------------------------------------------------------------
  //------------------------set up editor--------------------------
  //---------------------------------------------------------------
  var editor1 = ace.edit("editor1");
  editor1.setTheme("ace/theme/monokai");
  editor1.getSession().setMode("ace/mode/javascript");
  var editor2 = ace.edit("editor2");
  editor2.setTheme("ace/theme/monokai");
  editor2.getSession().setMode("ace/mode/javascript");
  var consoleLog = ace.edit("console");
  consoleLog.setReadOnly(true);
  consoleLog.setOptions({
    highlightActiveLine: false,
    highlightGutterLine: false
  });
  consoleLog.renderer.$cursorLayer.element.style.opacity = 0
  resize();

  function resize() {
    var h = window.innerHeight;
    document.getElementById('editor1').style.height = (h - 160) + "px";
    document.getElementById('console').style.top = (h - 160) + "px";
  }
  window.addEventListener('resize', resize, false);

  //when run is clicked, parse the string input
  document.getElementById('run').onclick = function evaluate() {
    //console.log(editor1.getValue())
    //parse(editor1.getValue());
    parse(editor1.session.doc.getAllLines());
  };

  var Range = ace.require("ace/range").Range;

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
      postStr = str.replace(/forward\(\)/, "tasks.push(['f'," + index + "])");
      postStr = postStr.replace(/backward\(\)/, "tasks.push(['b'," + index + "])");
      postStr = postStr.replace(/left\(\)/, "tasks.push(['l'," + index + "])");
      postStr = postStr.replace(/right\(\)/, "tasks.push(['r'," + index + "])");
      postStr = postStr.replace(/up\(\)/, "tasks.push(['u'," + index + "])");
      postStr = postStr.replace(/down\(\)/, "tasks.push(['d'," + index + "])");
      return postStr;
    }

    //postStr
    //console.log(postStr);
    try {
      eval(endStr);
    } catch (err) {
      console.log(err);
      consoleLog.insert(err + '\n');
    }
    //console.log(tasks + " " + tasks.length);
    //console.log(tasks);
    try {
      taskManager.executeTasks(tasks);
      consoleLog.insert(err + '\n');
    } catch (err) {

    }
  }

  //----------------------------------------------------------------
  //------------------------ task manager --------------------------
  //----------------------------------------------------------------
  var UNIT = 0.25;
  var taskManager = new TaskManager();
  var marker = null;

  function TaskManager() {
    this.tasks = [];
  }

  TaskManager.prototype.executeTasks = function (tasks, callback) {
    this.tasks = tasks;
    this.tasksNum = tasks.length;
    this.taskCallback = callback;
    this._execute();
  };

  TaskManager.prototype._execute = function () {
    var that = this;
    if (marker) {
      editor1.session.removeMarker(marker);
      marker = null;
    }
    if (!this.tasks.length) {
      transit(false);
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
      marker = editor1.session.addMarker(new Range(lineNum, 0, lineNum, 2000), 'highlight', 'fullLine', false);
      this.move(direction);
    }
  };

  TaskManager.prototype.move = function (direction) {
    var that = this;
    for (var i = 0; i < 50 / UNIT + 1; i++) {
      if (i < 50 / UNIT) {
        setTimeout(function () {
          switch (direction) {
          case 'f':
            you.position.z -= UNIT;
            break;
          case 'b':
            you.position.z += UNIT;
            break;
          case 'r':
            you.position.x += UNIT;
            break;
          case 'l':
            you.position.x -= UNIT;
            break;
          case 'u':
            you.position.y += UNIT;
            break;
          case 'd':
            you.position.y -= UNIT;
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
      for (var j = 0; j < TIME_PERIOD + 1; j++) {
        if (j === TIME_PERIOD / 2) {

        }
        if (j < TIME_PERIOD) {
          setTimeout(function () {

            camera.position.x -= (deltaX / TIME_PERIOD);
            camera.position.y -= (deltaY / TIME_PERIOD);
            camera.position.z -= (deltaZ / TIME_PERIOD);

          }, j);
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
        if (j === TIME_PERIOD / 2) {

        }
        if (j < TIME_PERIOD) {
          setTimeout(function () {

            camera.position.x += (deltaX / TIME_PERIOD);
            camera.position.y += (deltaY / TIME_PERIOD);
            camera.position.z += (deltaZ / TIME_PERIOD);

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

})(this);