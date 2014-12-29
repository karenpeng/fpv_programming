var getSimilarValue = require('./myMath.js').getSimilarValue;

module.exports = {
  initTargetandObstacles: function () {
    var tarX = 375 - (Math.floor(Math.pow(Math.random(), 2) * 10) + 6) * 50;
    var tarY;
    var ran = Math.random();
    if (ran < 0.6) {
      tarY = 25;

    } else if (ran < 0.9) {
      tarY = 75;
    } else {
      tarY = 125;
    }
    var tarZ = 375 - (Math.floor(Math.pow(Math.random(), 2) * 10) + 6) * 50;

    var obs = this.initObstacles(tarX, tarY, tarZ);

    return {
      'tar': {
        "x": tarX,
        "y": tarY,
        "z": tarZ
      },
      'obs': obs
    };
  },

  initObstacles: function (tarX, tarY, tarZ) {
    var obsInfo = [];
    var oriX = (375 - tarX) / 50;
    var oriZ = (375 - tarZ) / 50;
    for (j = 0; j < 24; j++) {
      var x, y, z;
      do {
        x = 375 - Math.round(getSimilarValue(oriX, 0, 16)) * 50;
        z = 375 - Math.round(getSimilarValue(oriZ, 0, 16)) * 50;

        var ran = Math.random();
        if (ran > 0.8) {
          y = 25 + Math.floor(Math.random() * 6) * 50;
        } else if (ran > 0.4) {
          y = 25;
        } else {
          y = 75;
        }

      } while (x === 375 && z === 375 || x === tarX && y === tarY && z === tarZ);

      obsInfo.push({
        "x": x,
        "y": y,
        "z": z
      });
    }
    return obsInfo;
  }
};