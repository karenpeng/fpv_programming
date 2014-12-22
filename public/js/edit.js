(function (exports) {

  //---------------------------------------------------------------
  //------------------------set up editor--------------------------
  //---------------------------------------------------------------

  var Range = ace.require("ace/range").Range;
  exports.isRunning = false;
  var editing = false;

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
  exports.consoleLog = consoleLog;
  resize();

  function addMarkerRange(lineNum) {
    return new Range(lineNum, 0, lineNum, 2000);
  }
  exports.addMarkerRange = addMarkerRange;

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
      isRunning = true;
      parse(editor1.session.doc.getAllLines());
      if (realGame) {
        clock2Run();
      }
    }
  };

  document.getElementById('reset').onclick = function () {
    editor1.setValue("");
  };

  editor1.on("change", function () {
    //console.log(editor1.getValue());
    socket.emit('typing code', editor1.getValue());
  });

  socket.on('code', function (data) {
    editor2.setValue(data);
    editor2.clearSelection();
  });

  editor1.on("blur", function () {
    editing = false;
  });

  //i'm so sorry i need to hijack the keyboard
  window.onkeydown = function (e) {
    if (!editing) {
      e.preventDefault();
    }
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
      isRunning = false;
      consoleLog.insert(err + '\n');
      console.log(err);
      return;
    }

    try {
      taskManager.executeTasks(tasks);
    } catch (err) {
      isRunning = false;
      consoleLog.insert(err + '\n');
      console.log(err);
    }
  }

})(this);