function change(str) {
  // str.forEach(function (char) {
  //   if (char === 'z') {
  //     str.insert('mesh.')
  //   }
  // })
  var post = str;
  for (var key in table) {
    //console.log(key, table[key]);
    var pattern = new RegExp(key, 'g');
    var result = post.replace(pattern, table[key]);
    post = result;
  }
  // var post = str.replace('.z', '');
  // post = post.replace('.x', '.mesh.position.x');
  // post = post.replace('.y', '.mesh.position.y');
  // //var f = A.update();
  //return post;
  list[0] = result;
}

//if i encounter z, i will change it into xxx.mesh.position.z
var table = {
  '.x': '.mesh.position.x',
  '.y': '.mesh.position.y',
  '.z': '.mesh.position.z'
}