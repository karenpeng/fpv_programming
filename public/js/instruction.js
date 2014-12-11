(function (exports) {
  var canvas = document.getElementsByTagName("CANVAS")[0];
  canvas.style.cursor = "url('img/drag.png'), default";

  var back = document.getElementById('back');
  var next = document.getElementById('next');
  var content = document.getElementById('content');
  var processBar = document.getElementById('processBar');
  var level = 0;
  back.style.display = "none";

  //----------------------------------------------------------------
  //---------------------  change instruction   --------------------
  //----------------------------------------------------------------

  next.onclick = function () {
    level++;
    //console.log(level)
    changeContent(level);
  };

  back.onclick = function () {
    level--;
    changeContent(level);
  };

  function changeContent(number) {
    var strs;
    switch (number) {
    case 1:
      strs = level1;
      back.style.display = "none";
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
      next.innerHTML = "next";
      break;
    case 5:
      strs = level5;
      next.innerHTML = "start game";
      break;
    case 6:
      waitingForReady();
      break;
    }
    var str = "";
    strs.forEach(function (l) {
      str += "<p>";
      str += l;
      str += "</p>";
    });
    content.innerHTML = str;
    processBar.style.width = level * 35 + 35 + "px";

  }

  var level1 = [
    "There're only 6 instructions, which are:",
    "forward()",
    "backward()",
    "left()",
    "right()",
    "up()",
    "down()",
    "That's it.",
    "Try type them in the editor on the right, when you finish, click the 'run' button."
  ];

  var level2 = [
    "What if you want to move it forward ten steps?",
    "Well, you don't have to type it 10 times.",
    "Here's how a 'loop' can help you:",
    "",
    "for(var i = 0; i < 10; i++){",
    " forward()",
    "}",
    "Try it in the editor, if you like, try with numbers and instrunctions"
  ];

  var level3 = [
    "If you make the iterator as a reusable tool, you don't have to remake it over and over again.",
    "Here's how a 'function' works as a 'tool':",
    "function f(steps){",
    " for(var i = 0; i < steps; i++){",
    "   forward()",
    " }",
    "}",
    "And here's how to 'use' this tool:",
    "f(4)",
    "f(6)"
  ];

  var level4 = [
    "There's always obstacles:)",
    "See the CAT cubes? They're obstacles which will get in your way.",
    "Try to go through them and see what happens."
  ];

  var level5 = [
    "Clock's Ticking!",
    "In the real game, you need to compete with other to get to the target as soon as possible.",
    "",
    "Are you ready?",
    "Invite your friend, give them this url."
  ];

})(this);