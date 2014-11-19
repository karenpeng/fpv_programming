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

  // function Marker(lineNum) {
  //   var r = new Range(lineNum, 0, 1, 200), "highlight", "fullLine");
  //   return r;
  // }
  // var marker = new Marker(1);
  // console.log(marker);
  // editor1.session.addMarker(marker);
  editor1.session.addMarker(new Range(1, 0, 1, 200), "highlight", "fullLine");
  // editor1.session.addMarker(new Range(2, 0, 1, 200), "highlight", "fullLine", false);
  //editor1.getSession().removeMarker(marker);

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
      postStr = str.replace(/forward\(\)/, "tasks.push(['f'," + (index + 1) + "])");
      postStr = postStr.replace(/backward\(\)/, "tasks.push(['b'," + (index + 1) + "])");
      postStr = postStr.replace(/left\(\)/, "tasks.push(['l'," + (index + 1) + "])");
      postStr = postStr.replace(/right\(\)/, "tasks.push(['r'," + (index + 1) + "])");
      postStr = postStr.replace(/up\(\)/, "tasks.push(['u'," + (index + 1) + "])");
      postStr = postStr.replace(/down\(\)/, "tasks.push(['d'," + (index + 1) + "])");
      return postStr;
    }

    // //postStr
    // //console.log(postStr);
    eval(endStr);
    // //console.log(tasks + " " + tasks.length);
    console.log(tasks);
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
      this.move(ta[0], ta[1]);
    }
  };

  TaskManager.prototype.move = function (direction, lineNum) {
    var that = this;
    var marker;
    for (var i = 0; i < 50 / UNIT + 1; i++) {
      if (i < 50 / UNIT) {
        setTimeout(function () {
          marker = new Marker(lineNum);
          editor1.session.addMarker(marker);
          switch (direction) {
          case 'f':
            // if (you.direction === 'left') {
            //   you.rotation.y = -Math.PI / 2;

            // } else if (you.direction === 'right') {
            //   you.rotation.y = Math.PI / 2;
            // }
            // you.direction = 'front';
            you.position.z -= UNIT;

            break;
          case 'b':
            // if (you.direction === 'left') {
            //   you.rotation.y = -Math.PI / 2;

            // } else if (you.direction === 'right') {
            //   you.rotation.y = Math.PI / 2;
            // }
            // you.direction = 'front';
            break;
          case 'r':
            // if (you.direction === 'front') {
            //   you.rotation.y = -Math.PI / 2;
            //   you.direction = 'right';
            // } else if (you.direction === 'left') {
            //   you.rotation.y = Math.PI / 2;
            //   you.direction = 'right';
            // }
            // you.direction = 'right';

            break;
          case 'l':
            // if (you.direction === 'front') {
            //   you.rotation.y = Math.PI / 2;
            //   you.direction = 'left';
            // } else if (you.direction === 'right') {
            //   you.rotation.y = -Math.PI / 2;
            //   you.direction = 'left';
            // }
            // you.direction = 'left';
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
          editor1.getSession().removeMarker(marker);
          that._execute();
        }, 50 / UNIT + 1000);
      }
    }
  };

  //-----------------------------------------------------------
  //---------------------- move the camera --------------------
  //-----------------------------------------------------------

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