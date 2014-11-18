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
    parse(editor1.getValue());
  };

  //---------------------------------------------------------------
  //------------------------    parse    --------------------------
  //---------------------------------------------------------------
  var tasks = [];

  function parse(str) {
    tasks = [];
    var postStr = str.replace(/forward\(\)/g, "tasks.push('f')");
    postStr = postStr.replace(/backward\(\)/g, "tasks.push('b')");
    postStr = postStr.replace(/left\(\)/g, "tasks.push('l')");
    postStr = postStr.replace(/right\(\)/g, "tasks.push('r')");
    postStr = postStr.replace(/up\(\)/g, "tasks.push('u')");
    postStr = postStr.replace(/down\(\)/g, "tasks.push('d')");
    //postStr
    console.log(postStr);
    eval(postStr);
    console.log(tasks + " " + tasks.length);
    taskManager.executeTasks(tasks);
  }

  //----------------------------------------------------------------
  //------------------------ task manager --------------------------
  //----------------------------------------------------------------
  var UNIT = 0.25;
  var taskManager = new TaskManager();

  function TaskManager() {
    this.tasks = [];
  }

  TaskManager.prototype.executeTasks = function (tasks, callback) {
    this.tasks = tasks;
    this.taskCallback = callback;
    this._execute();
  };

  TaskManager.prototype._execute = function () {
    if (!this.tasks.length) {
      endExecution();
      return;
    } else {
      beginExecution();
      var ta = this.tasks.shift();
      this.move(ta);
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
          //if callback is passed in
          that._execute();
        }, 50 / UNIT + 1000);
      }
    }
  };

  function beginExecution() {
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 0;
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