//module.exports = {

exports.map = function (value, curMin, curMax, desMin, desMax) {
  return value * (desMax - desMin) / (curMax - curMin);
}

exports.lerp = function (begin, end, persentage) {
  return end + (end - begin) * persentage;
}

exports.constrain = function (value, minBounce, maxBounce) {
  if (value < minBounce) return minBounce;
  if (value > maxBounce) return maxBounce;
  return value;
}

exports.getSimilarValue = function (value, min, max) {
  var leftPortion = value - min;
  var rightPortion = max - value;
  var ran = Math.random() * (max - min);

  //console.log(this.map);

  if (ran < value) {
    var somevalue = Math.random() * leftPortion;
    var newvalue = exports.map(somevalue * somevalue, 0, leftPortion * leftPortion, 0, leftPortion);
    return value - newvalue;

  } else {
    var somevalue = Math.random() * rightPortion;
    var newvalue = exports.map(somevalue * somevalue, 0, rightPortion * rightPortion, 0, rightPortion);
    return value + newvalue;
  }

}

//};