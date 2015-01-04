(function (exports) {

  //---------------------------------------------------------------
  //------------------------set up editor--------------------------
  //---------------------------------------------------------------

  var Range = ace.require("ace/range").Range;

  function addMarkerRange(lineNum) {
    return new Range(lineNum, 0, lineNum, 2000);
  }
  exports.addMarkerRange = addMarkerRange;
  exports.isRunning = false;
  var editing = false;

  //editor for user to code
  var editor1 = ace.edit("editor1");
  editor1.setTheme("ace/theme/monokai");
  editor1.getSession().setMode("ace/mode/javascript");
  editor1.session.selection.moveCursorDown();
  editor1.on('focus', function () {
    editing = true;
    document.getElementById('editor1').style.opacity = '0.9';
    document.getElementById('console').style.opacity = '0.9';
    document.getElementById('gap').style.opacity = '0.9';
  });
  exports.editor1 = editor1;

  //console for user
  var consoleLog = ace.edit("console");
  consoleLog.setReadOnly(true);
  consoleLog.setOptions({
    highlightActiveLine: false,
    highlightGutterLine: false
  });
  consoleLog.renderer.$cursorLayer.element.style.opacity = 0;
  exports.consoleLog = consoleLog;
  resize();

  //editor to show other user's code
  var editor2 = ace.edit("editor2");
  editor2.setTheme("ace/theme/monokai");
  editor2.getSession().setMode("ace/mode/javascript");
  editor2.setReadOnly(true);
  editor2.setOptions({
    highlightActiveLine: false,
    highlightGutterLine: false
  });
  editor2.renderer.$cursorLayer.element.style.opacity = 0;

  function resize() {
    var h = window.innerHeight;
    document.getElementById('editor1').style.height = (h - 150) + "px";
    document.getElementById('console').style.top = (h - 120) + "px";
  }
  window.addEventListener('resize', resize, false);

  var runTime = 0;
  //when run is clicked, parse the string input
  document.getElementById('run').onclick = function () {
    //console.log(editor1.getValue())
    //parse(editor1.getValue());
    if (!isRunning) {
      isRunning = true;
      parse(editor1.session.doc.getAllLines());
      if (realGame) {
        runTime++;
        document.getElementById('timer3').innerHTML = runTime;
        clock2Run();
      }
    }
  };

  document.getElementById('reset').onclick = function () {
    editor1.setValue("");
  };

  editor1.on("blur", function () {
    editing = false;
  });

  //i'm so sorry i need to hijack the keyboard
  window.onkeydown = function (e) {
    if (!editing) {
      e.preventDefault();
    }
  };

  //set up socket event for coding

  editor1.on("change", function () {
    //console.log(editor1.getValue());
    if (realGame) {
      socket.emit('typing code', {
        'url': myURL,
        'data': editor1.getValue()
      });
    }
  });

  socket.on('code', function (data) {
    editor2.setValue(data);
    editor2.clearSelection();
  });

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

    //define a function inside a function b/c only it ueses it
    function replace(str, index) {
      var postStr = str;
      postStr = postStr.replace(/forward\(\)/g, "tasks.push(['f'," + index + "])");
      postStr = postStr.replace(/backward\(\)/g, "tasks.push(['b'," + index + "])");
      postStr = postStr.replace(/left\(\)/g, "tasks.push(['l'," + index + "])");
      postStr = postStr.replace(/right\(\)/g, "tasks.push(['r'," + index + "])");
      postStr = postStr.replace(/up\(\)/g, "tasks.push(['u'," + index + "])");
      postStr = postStr.replace(/down\(\)/g, "tasks.push(['d'," + index + "])");
      //making it as separate line again
      postStr += '\n';
      return postStr;
    }

    try {
      //console.log(endStr);
      eval(endStr);
    } catch (err) {
      isRunning = false;
      consoleLog.insert(err + '\n');
      console.log(err);
      //if there's error, just return, no need to pass to taskManager
      return;
    }

    try {
      taskManager.executeTasks(you, tasks, true);
    } catch (err) {
      isRunning = false;
      consoleLog.insert(err + '\n');
      console.log(err);
    }
  }

})(this);