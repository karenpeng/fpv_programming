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
    var endStr = ""; //= [];
    strArray.forEach(function (str, index) {
      endStr += (replace(str, index));
    });
    console.log(endStr);

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

    // //postStr
    // //console.log(postStr);
    try {
      eval(endStr);
    } catch (err) {

    }
    // //console.log(tasks + " " + tasks.length);
    console.log(tasks);
    try {
      taskManager.executeTasks(tasks);
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
    this.taskCallback = callback;
    this._execute();
  };

  TaskManager.prototype._execute = function () {
    if (marker) {
      editor1.session.removeMarker(marker);
      marker = null;
    }
    if (!this.tasks.length) {
      endExecution();
      return;
    } else {
      beginExecution();
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

  function beginExecution() {
    camera.position.x = 50;
    camera.position.y = 80;
    camera.position.z = 130;
    you.add(camera);
    you.idle = false;
  }

  function endExecution() {
    you.remove(camera);
    camera.position.x = 500;
    camera.position.y = 800;
    camera.position.z = 1300;
    you.idle = true;
  }

})(this);