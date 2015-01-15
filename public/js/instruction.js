(function (exports) {
  var canvas = document.getElementsByTagName("CANVAS")[0];
  canvas.style.cursor = "url('img/drag.png'), default";

  var back = document.getElementById('back');
  var next = document.getElementById('next');
  var content = document.getElementById('content');
  var processBar = document.getElementById('processBar');
  exports.level = 0;
  back.style.display = "none";

  //----------------------------------------------------------------
  //---------------------  change instruction   --------------------
  //----------------------------------------------------------------

  next.onclick = function () {
    exports.level++;
    //console.log(level)
    changeContent(exports.level);
  };

  back.onclick = function () {
    exports.level--;
    changeContent(exports.level);
  };

  function changeContent(number) {
    var strs;
    switch (number) {
    case 0:
      strs = level0;
      back.style.display = "none";
      break;
    case 1:
      strs = level1;
      back.style.display = "block";
      document.getElementById('skip').style.display = "none";
      break;
    case 2:
      strs = level2;
      back.style.display = "block";
      var question = document.createElement('p');
      question.innerHTML = "What does this mean?";
      content.appendChild(question);
      break;
    case 3:
      strs = level3;
      var question = document.createElement('p');
      question.innerHTML = "What does this mean?";
      content.appendChild(question);
      break;
    case 4:
      strs = level4;
      moveTarget();
      break;
    case 5:
      strs = level5;
      next.innerHTML = "next";
      break;
    case 6:
      strs = level6;
      next.innerHTML = "start game";
      break;
    case 7:
      waitingForReady();
      return;
    }
    var str = "";
    strs.forEach(function (l) {
      str += "<p>";
      str += l;
      str += "</p>";
    });
    content.innerHTML = str;
    processBar.style.width = exports.level * 30 + 30 + "px";

  }

  var level0 = [
    "Welcome!",
    "See the yellow cube? That's your character.",
    "And the red cube? That's your target.",
    "To play this game, you need to move your character to the target.",
    "To do that, you need to write some instructions for your character.",
    "Wanna learn how to do it?",
    "Let's go!!!"
  ];

  var level1 = [
    "Tutorial 1: instruntion",
    "<p></p>",
    "There're only 6 instructions, which are:",
    "<code>forward();",
    "backward();",
    "left();",
    "right();",
    "up();",
    "down();</code>",
    "That's it.",
    "Try type them in the editor on the right, when you finish, click the 'run' button."
  ];

  var level2 = [
    "Tutorial 2: loop",
    "<p></p>",
    "What if you want to move it forward ten steps?",
    "Well, you don't have to type it 10 times.",
    "Here's how a 'loop' can help you:",
    "<p></p>",
    "<code>for(var i = 0; i < 10; i++){",
    "&nbspforward();",
    "}</code>",
    "Try it in the editor, if you like, try with numbers and instrunctions"
  ];

  var level3 = [
    "Tutorial 3: function",
    "<p></p>",
    "If you make the iterator as a reusable tool, you don't have to remake it over and over again.",
    "Here's how a 'function' works as a 'tool':",
    "<code>function f(steps){",
    "&nbspfor(var i = 0; i < steps; i++){",
    "&nbsp&nbspforward();",
    "&nbsp}",
    "}</code>",
    "And here's how to 'use' this tool:",
    "<code>f(4);",
    "f(6);</code>"
  ];

  var level4 = [
    "Tutorial 4: target",
    "<p></p>",
    "Target will Move!",
    "The target will move a little bit every 30 seconds.",
    "Sorry this is reality, you need to keep pace with it."
  ];

  var level5 = [
    "Tutorial 5: obstacle",
    "<p></p>",
    "There's always obstacles:)",
    "See the CAT cubes? They're obstacles which will get in your way.",
    "Try to go through them and see what happens."
  ];

  var level6 = [
    "Are you ready?",
    "<p></p>",
    "In the real game, you need to get to the target as soon as possible， competing with your friend."
  ];

})(this);
