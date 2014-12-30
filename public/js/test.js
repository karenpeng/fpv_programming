(function () {
  function transitCamera(timeSpeed, callback) {
    var TIME_PERIOD = 400;
    var deltaX, deltaY, deltaZ;
    if (timeSpeed) {
      deltaX = camera.position.x - 100;
      deltaY = camera.position.y - 160;
      deltaZ = camera.position.z - 200;
      you.add(camera);

      do {
        //this won't work b/c there's no animation frame,
        //it will execute all at once
        //no matter how small the increment is
        camera.position.x -= (deltaX / TIME_PERIOD);
        camera.position.y -= (deltaY / TIME_PERIOD);
        camera.position.z -= (deltaZ / TIME_PERIOD);
      } while (camera.position.x > 100);

    } else {
      deltaX = camera.position.x - 500;
      deltaY = camera.position.y - 800;
      deltaZ = camera.position.z - 1000;
      you.remove(camera);

      do {
        camera.position.x -= (deltaX / TIME_PERIOD);
        camera.position.y -= (deltaY / TIME_PERIOD);
        camera.position.z -= (deltaZ / TIME_PERIOD);
      } while (camera.position.x < 500);
    }

    if (callback) {
      callback();
    }
  }

});