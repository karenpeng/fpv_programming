if (!Detector.webgl) Detector.addGetWebGLMessage();

var container, stats;

var camera, controls, scene, renderer;

var cross;

var giantBox;
var morphs = [];
var clock = new THREE.Clock();

var areaLight1;
var isUserInteracting = false,
  onMouseDownMouseX = 0,
  onMouseDownMouseY = 0,
  lon = 0,
  onMouseDownLon = 0,
  lat = 0,
  onMouseDownLat = 0,
  phi = 0,
  theta = 0;
var cube;
var postprocessing = {
  //enabled: true
  enabled: false
};
var margin = 100;
var height = window.innerHeight - 2 * margin;
var bgColor = 0x000511;
var sunColor = 0xffee00;
var projector = new THREE.Projector();
var materialDepth;
var sunPosition = new THREE.Vector3(0, 6000, -1000);
var screenSpacePosition = new THREE.Vector3();

init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  //camera.position.z = 500;
  camera.target = new THREE.Vector3(0, 300, 0);
  camera.position.z = 50;

  controls = new THREE.TrackballControls(camera);

  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;

  controls.noZoom = false;
  controls.noPan = false;

  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

  controls.keys = [65, 83, 68];

  controls.addEventListener('change', render);

  // world

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xcccccc, 0.0002);

  // LIGHTS

  //addShadowedLight(1, 1, 1, 0xffffff, 1.35);
  //addShadowedLight(0.5, 1, -1, 0xffaa00, 1);
  var materialDepth = new THREE.MeshDepthMaterial();

  var materialScene = new THREE.MeshBasicMaterial({
    color: 0x000000,
    shading: THREE.FlatShading
  });

  var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  hemiLight.color.setHSL(0.6, 1, 0.6);
  hemiLight.groundColor.setHSL(0.095, 1, 0.75);
  hemiLight.position.set(0, 500, 0);
  scene.add(hemiLight);

  //

  var dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.color.setHSL(0.1, 1, 0.95);
  dirLight.position.set(-1, 1.75, 1);
  dirLight.position.multiplyScalar(50);
  scene.add(dirLight);

  dirLight.castShadow = true;

  dirLight.shadowMapWidth = 2048;
  dirLight.shadowMapHeight = 2048;

  var d = 50;

  dirLight.shadowCameraLeft = -d;
  dirLight.shadowCameraRight = d;
  dirLight.shadowCameraTop = d;
  dirLight.shadowCameraBottom = -d;

  dirLight.shadowCameraFar = 3500;
  dirLight.shadowBias = -0.0001;
  dirLight.shadowDarkness = 0.35;
  //dirLight.shadowCameraVisible = true;
  // lights

  // light = new THREE.AmbientLight(0x222222);
  // scene.add(light);

  // addShadowedLight(1, 1, 1, 0xffffff, 1);
  // addShadowedLight(0.5, 1, -1, 0xffaa00, 0.75);

  // light = new THREE.DirectionalLight(0xffffff);
  // light.position.set(1, 1, 1);
  // scene.add(light);
  // // light.castShadow = true;
  // // light.shadowCameraNear = 1200;
  // // light.shadowCameraFar = 2500;
  // // light.shadowCameraFov = 50;

  // light = new THREE.DirectionalLight(0x002288);
  // light.position.set(-1, -1, -1);
  // scene.add(light);

  // var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  // hemiLight.color.setHSL(0.6, 1, 0.6);
  // hemiLight.groundColor.setHSL(0.095, 1, 0.75);
  // hemiLight.position.set(0, 500, 0);
  // scene.add(hemiLight);

  var sphere = new THREE.SphereGeometry(0.2, 16, 8);

  var intensity = 2.5;
  var distance = 50;
  var c1 = 0xff0040,
    c2 = 0x0040ff,
    c3 = 0x80ff80,
    c4 = 0xffaa00,
    c5 = 0x00ffaa,
    c6 = 0xff1100;

  light1 = new THREE.PointLight(c1, intensity, distance);
  light1.add(new THREE.Mesh(sphere, new THREE.MeshPhongMaterial({
    color: c1
  })));
  light1.position.y = Math.random() * 10;

  //light.shadowCameraVisible = true;

  light1.shadowBias = 0.0001;
  light1.shadowDarkness = 0.5;

  light1.shadowMapWidth = window.innerWidth;
  light1.shadowMapHeight = window.innerHeight;
  //scene.add(light1);

  light2 = new THREE.PointLight(c2, intensity, distance);
  light2.add(new THREE.Mesh(sphere, new THREE.MeshLambertMaterial({
    color: c2
  })));
  light2.position.y = Math.random() * 10;
  scene.add(light2);

  light3 = new THREE.PointLight(c3, intensity, distance);
  light3.add(new THREE.Mesh(sphere, new THREE.MeshLambertMaterial({
    color: c3
  })));
  light3.position.y = Math.random() * 10;
  scene.add(light3);

  light4 = new THREE.PointLight(c4, intensity, distance);
  light4.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
    color: c4
  })));
  light4.position.y = Math.random() * 10;
  scene.add(light4);

  light5 = new THREE.PointLight(c5, intensity, distance);
  light5.add(new THREE.Mesh(sphere, new THREE.MeshLambertMaterial({
    color: c5
  })));
  light5.position.y = Math.random() * 10;
  scene.add(light5);

  light6 = new THREE.PointLight(c6, intensity, distance);
  light6.add(new THREE.Mesh(sphere, new THREE.MeshLambertMaterial({
    color: c6
  })));
  scene.add(light6);

  areaLight1 = new THREE.AreaLight(0xff0000, 1);
  areaLight1.position.set(10.0001, 10.0001, 18.5001);
  areaLight1.rotation.set(-0.74719, 0.0001, 0.0001);
  areaLight1.width = 10;
  areaLight1.height = 1;
  scene.add(areaLight1);

  /*
  //
  //objects
  //
*/

  //Create a sine-like wave
  var curve = new THREE.SplineCurve([
    new THREE.Vector2(-10, 0),
    new THREE.Vector2(-5, 5),
    new THREE.Vector2(0, 0),
    new THREE.Vector2(5, -5),
    new THREE.Vector2(10, 0)
  ]);

  var path = new THREE.Path(curve.getPoints(50));

  var geometry = path.createPointsGeometry(50);
  var material = new THREE.LineBasicMaterial({
    color: 0xff0000
  });

  var object3d = new THREE.Line(geometry, material);
  scene.add(object3d);

  var geometry = new THREE.PlaneGeometry(2000, 2000);
  geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

  var material = new THREE.MeshPhongMaterial({
    // color: 0xccccff,
    // side: THREE.DoubleSide
    ambient: 0x999999,
    color: 0x999999,
    specular: 0x101010
  });
  var plane = new THREE.Mesh(geometry, material);
  plane.position.y = -20;

  scene.add(plane);
  plane.receiveShadow = true;

  //var plane2 = plane.clone();
  //var plane2 = new THREE.Mesh(geometry, new THREE.)
  //plane2.rotation.x = Math.PI / 2;
  //plane2.position.z = -100;
  //scene.add(plane2);

  // SKYDOME

  var vertexShader = document.getElementById('vertexShader').textContent;
  var fragmentShader = document.getElementById('fragmentShader').textContent;
  var uniforms = {
    topColor: {
      type: "c",
      value: new THREE.Color(0x0077ff)
    },
    bottomColor: {
      type: "c",
      value: new THREE.Color(0xffffff)
    },
    offset: {
      type: "f",
      value: 33
    },
    exponent: {
      type: "f",
      value: 0.6
    }
  };
  uniforms.topColor.value.copy(hemiLight.color);

  scene.fog.color.copy(uniforms.bottomColor.value);

  var skyGeo = new THREE.SphereGeometry(4000, 32, 15);
  var skyMat = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms,
    side: THREE.BackSide
  });

  var sky = new THREE.Mesh(skyGeo, skyMat);
  //scene.add(sky);

  geometry = new THREE.BoxGeometry(200, 2000, 100);
  //geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
  for (var i = 0, l = geometry.faces.length; i < l; i++) {

    var face = geometry.faces[i];
    face.vertexColors = new THREE.Color("rgb(" + i * 10 + "," + i * 10 + "," + i + ")");
  }
  material = new THREE.MeshPhongMaterial({
    vertexColors: THREE.VertexColors,
    //color: 0xff0000,
    side: THREE.DoubleSide
  });
  giantBox = new THREE.Mesh(geometry, material);
  //giantBox.position.y = 1000;
  //scene.add(giantBox);
  //giantBox.receiveShadow = true;

  geometry = new THREE.SphereGeometry(10, 20, 10);
  //geometry.position.z = -10;
  var ball = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0xffffff,
    shininess: 20,
    shading: THREE.FlatShading
  }));
  //ball.position.x = 40;
  ball.position.z = 50;
  ball.position.y = 30;
  ball.castShadow = true;
  ball.receiveShadow = true;

  scene.add(ball);

  geometry = new THREE.BoxGeometry(10, 10, 10);
  material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0xffffff,
    shininess: 20,
  });
  cube = new THREE.Mesh(geometry, material);
  cube.position.x = -20;
  cube.position.y = 10;
  cube.position.z = 30;
  scene.add(cube);
  cube.castShadow = true;

  var loader = new THREE.JSONLoader();

  loader.load("model/bird.js", function (geometry) {

    morphColorsToFaceColors(geometry);
    geometry.computeMorphNormals();

    var material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0xffffff,
      shininess: 20,
      morphTargets: true,
      morphNormals: true,
      vertexColors: THREE.FaceColors,
      shading: THREE.FlatShading
    });
    var meshAnim = new THREE.MorphAnimMesh(geometry, material);

    meshAnim.duration = 1000;

    var s = 0.35;
    meshAnim.scale.set(s, s, s);
    meshAnim.position.y = 15;
    meshAnim.rotation.y = -1;

    meshAnim.castShadow = true;
    meshAnim.receiveShadow = true;

    scene.add(meshAnim);
    morphs.push(meshAnim);

  });

  var loader2 = new THREE.BinaryLoader();
  loader2.load("model/box.js", function (geometry, materials) {

    var material = new THREE.MeshPhongMaterial({
      color: 0xffeeaa,
      specular: 0x888888,
      shininess: 200
    });
    var object = new THREE.Mesh(geometry, material);
    object.scale.multiplyScalar(20);
    //object.position.z = 40;
    object.position.y = -10;
    scene.add(object);
    object.receiveShadow = true;k

  });

  /*
//-------------------------------------
  // renderer
  //
*/
  container = document.getElementById('container');
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  renderer.setClearColor(scene.fog.color, 1);

  renderer.gammaInput = true;
  renderer.gammaOutput = true;

  renderer.shadowMapEnabled = true;
  renderer.shadowMapCullFace = THREE.CullFaceBack;

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  stats.domElement.style.zIndex = 100;
  container.appendChild(stats.domElement);

  //
  // document.addEventListener('mousedown', onDocumentMouseDown, false);
  // document.addEventListener('mousemove', onDocumentMouseMove, false);
  // document.addEventListener('mouseup', onDocumentMouseUp, false);
  // document.addEventListener('mousewheel', onDocumentMouseWheel, false);
  // document.addEventListener('DOMMouseScroll', onDocumentMouseWheel, false);
  window.addEventListener('resize', onWindowResize, false);

  //
  //initPostprocessing();
  //render();

}

window.onkeydown = function () {
  console.log(camera.position);
};

function addShadowedLight(x, y, z, color, intensity) {

  var directionalLight = new THREE.DirectionalLight(color, intensity);
  directionalLight.position.set(x, y, z);
  scene.add(directionalLight);

  directionalLight.castShadow = true;
  // directionalLight.shadowCameraVisible = true;

  var d = 1;
  directionalLight.shadowCameraLeft = -d;
  directionalLight.shadowCameraRight = d;
  directionalLight.shadowCameraTop = d;
  directionalLight.shadowCameraBottom = -d;

  directionalLight.shadowCameraNear = 1;
  directionalLight.shadowCameraFar = 4;

  directionalLight.shadowMapWidth = 1024;
  directionalLight.shadowMapHeight = 1024;

  directionalLight.shadowBias = -0.005;
  directionalLight.shadowDarkness = 0.15;

}

function morphColorsToFaceColors(geometry) {

  if (geometry.morphColors && geometry.morphColors.length) {

    var colorMap = geometry.morphColors[0];

    for (var i = 0; i < colorMap.colors.length; i++) {

      geometry.faces[i].color = colorMap.colors[i];

    }

  }

}

function onDocumentMouseDown(event) {

  event.preventDefault();

  isUserInteracting = true;

  onPointerDownPointerX = event.clientX;
  onPointerDownPointerY = event.clientY;

  onPointerDownLon = lon;
  onPointerDownLat = lat;

}

function onDocumentMouseMove(event) {

  if (isUserInteracting === true) {

    lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
    lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;

  }

}

function onDocumentMouseUp(event) {

  isUserInteracting = false;

}

function onDocumentMouseWheel(event) {

  // WebKit

  if (event.wheelDeltaY) {

    camera.fov -= event.wheelDeltaY * 0.05;

    // Opera / Explorer 9

  } else if (event.wheelDelta) {

    camera.fov -= event.wheelDelta * 0.05;

    // Firefox

  } else if (event.detail) {

    camera.fov += event.detail * 1.0;

  }

  camera.updateProjectionMatrix();

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  controls.handleResize();

  render();

}

function initPostprocessing() {

  postprocessing.scene = new THREE.Scene();

  postprocessing.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, height / 2, height / -2, -10000, 10000);
  postprocessing.camera.position.z = 100;

  postprocessing.scene.add(postprocessing.camera);

  var pars = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBFormat
  };
  postprocessing.rtTextureColors = new THREE.WebGLRenderTarget(window.innerWidth, height, pars);

  // Switching the depth formats to luminance from rgb doesn't seem to work. I didn't
  // investigate further for now.
  // pars.format = THREE.LuminanceFormat;

  // I would have this quarter size and use it as one of the ping-pong render
  // targets but the aliasing causes some temporal flickering

  postprocessing.rtTextureDepth = new THREE.WebGLRenderTarget(window.innerWidth, height, pars);

  // Aggressive downsize god-ray ping-pong render targets to minimize cost

  var w = window.innerWidth / 4.0;
  var h = height / 4.0;
  postprocessing.rtTextureGodRays1 = new THREE.WebGLRenderTarget(w, h, pars);
  postprocessing.rtTextureGodRays2 = new THREE.WebGLRenderTarget(w, h, pars);

  // god-ray shaders

  var godraysGenShader = THREE.ShaderGodRays["godrays_generate"];
  postprocessing.godrayGenUniforms = THREE.UniformsUtils.clone(godraysGenShader.uniforms);
  postprocessing.materialGodraysGenerate = new THREE.ShaderMaterial({

    uniforms: postprocessing.godrayGenUniforms,
    vertexShader: godraysGenShader.vertexShader,
    fragmentShader: godraysGenShader.fragmentShader

  });

  var godraysCombineShader = THREE.ShaderGodRays["godrays_combine"];
  postprocessing.godrayCombineUniforms = THREE.UniformsUtils.clone(godraysCombineShader.uniforms);
  postprocessing.materialGodraysCombine = new THREE.ShaderMaterial({

    uniforms: postprocessing.godrayCombineUniforms,
    vertexShader: godraysCombineShader.vertexShader,
    fragmentShader: godraysCombineShader.fragmentShader

  });

  var godraysFakeSunShader = THREE.ShaderGodRays["godrays_fake_sun"];
  postprocessing.godraysFakeSunUniforms = THREE.UniformsUtils.clone(godraysFakeSunShader.uniforms);
  postprocessing.materialGodraysFakeSun = new THREE.ShaderMaterial({

    uniforms: postprocessing.godraysFakeSunUniforms,
    vertexShader: godraysFakeSunShader.vertexShader,
    fragmentShader: godraysFakeSunShader.fragmentShader

  });

  postprocessing.godraysFakeSunUniforms.bgColor.value.setHex(bgColor);
  postprocessing.godraysFakeSunUniforms.sunColor.value.setHex(sunColor);

  postprocessing.godrayCombineUniforms.fGodRayIntensity.value = 0.75;

  postprocessing.quad = new THREE.Mesh(new THREE.PlaneGeometry(window.innerWidth, height), postprocessing.materialGodraysGenerate);
  postprocessing.quad.position.z = -9900;
  postprocessing.scene.add(postprocessing.quad);

}

function animate() {

  requestAnimationFrame(animate);

  var time = Date.now() * 0.00025;

  camera.position.z += 0.2;

  // if (isUserInteracting === false) {

  //   lon += 0.1;

  // }

  // lat = Math.max(-85, Math.min(85, lat));
  // phi = THREE.Math.degToRad(90 - lat);
  // theta = THREE.Math.degToRad(lon);

  // camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
  // camera.target.y = 500 * Math.cos(phi);
  // camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
  // camera.lookAt(camera.target);

  var delta = clock.getDelta();
  /*
  // distortion
  camera.position.copy( camera.target ).negate();
  */

  //controls.update();

  for (var i = 0; i < morphs.length; i++) {

    morph = morphs[i];
    morph.updateAnimation(1000 * delta);

  }

  var z = 20,
    d = 100;

  light1.position.x = Math.sin(time * 0.7) * d;
  light1.position.z = Math.cos(time * 0.3) * d;

  light2.position.x = Math.cos(time * 0.3) * d;
  light2.position.z = Math.sin(time * 0.7) * d;

  light3.position.x = Math.sin(time * 0.7) * d;
  light3.position.z = Math.sin(time * 0.5) * d;

  light4.position.x = Math.sin(time * 0.3) * d;
  light4.position.z = Math.sin(time * 0.5) * d;

  light5.position.x = Math.cos(time * 0.3) * d;
  light5.position.z = Math.sin(time * 0.5) * d;

  light6.position.x = Math.cos(time * 0.7) * d;
  light6.position.z = Math.cos(time * 0.5) * d;

  areaLight1.position.x = Math.sin(Date.now() * 0.001) * 9;
  areaLight1.position.y = Math.sin(Date.now() * 0.0013) * 5 + 5;

  controls.update();

  render();

}

function render() {
  // renderer = new THREE.WebGLRenderer({
  //   antialias: true
  // });
  // renderer.shadowMapEnabled = true;
  // renderer.shadowMapType = THREE.PCFShadowMap;

  //renderer.render(scene, camera);
  stats.update();

  if (postprocessing.enabled) {

    // Find the screenspace position of the sun

    screenSpacePosition.copy(sunPosition);
    projector.projectVector(screenSpacePosition, camera);

    screenSpacePosition.x = (screenSpacePosition.x + 1) / 2;
    screenSpacePosition.y = (screenSpacePosition.y + 1) / 2;

    // Give it to the god-ray and sun shaders

    postprocessing.godrayGenUniforms["vSunPositionScreenSpace"].value.x = screenSpacePosition.x;
    postprocessing.godrayGenUniforms["vSunPositionScreenSpace"].value.y = screenSpacePosition.y;

    postprocessing.godraysFakeSunUniforms["vSunPositionScreenSpace"].value.x = screenSpacePosition.x;
    postprocessing.godraysFakeSunUniforms["vSunPositionScreenSpace"].value.y = screenSpacePosition.y;

    // -- Draw sky and sun --

    // Clear colors and depths, will clear to sky color

    renderer.clearTarget(postprocessing.rtTextureColors, true, true, false);

    // Sun render. Runs a shader that gives a brightness based on the screen
    // space distance to the sun. Not very efficient, so i make a scissor
    // rectangle around the suns position to avoid rendering surrounding pixels.

    var sunsqH = 0.74 * height; // 0.74 depends on extent of sun from shader
    var sunsqW = 0.74 * height; // both depend on height because sun is aspect-corrected

    screenSpacePosition.x *= window.innerWidth;
    screenSpacePosition.y *= height;

    renderer.setScissor(screenSpacePosition.x - sunsqW / 2, screenSpacePosition.y - sunsqH / 2, sunsqW, sunsqH);
    renderer.enableScissorTest(true);

    postprocessing.godraysFakeSunUniforms["fAspect"].value = window.innerWidth / height;

    postprocessing.scene.overrideMaterial = postprocessing.materialGodraysFakeSun;
    renderer.render(postprocessing.scene, postprocessing.camera, postprocessing.rtTextureColors);

    renderer.enableScissorTest(false);

    // -- Draw scene objects --

    // Colors

    scene.overrideMaterial = null;
    renderer.render(scene, camera, postprocessing.rtTextureColors);

    // Depth

    scene.overrideMaterial = materialDepth;
    renderer.render(scene, camera, postprocessing.rtTextureDepth, true);

    // -- Render god-rays --

    // Maximum length of god-rays (in texture space [0,1]X[0,1])

    var filterLen = 1.0;

    // Samples taken by filter

    var TAPS_PER_PASS = 6.0;

    // Pass order could equivalently be 3,2,1 (instead of 1,2,3), which
    // would start with a small filter support and grow to large. however
    // the large-to-small order produces less objectionable aliasing artifacts that
    // appear as a glimmer along the length of the beams

    // pass 1 - render into first ping-pong target

    var pass = 1.0;
    var stepLen = filterLen * Math.pow(TAPS_PER_PASS, -pass);

    postprocessing.godrayGenUniforms["fStepSize"].value = stepLen;
    postprocessing.godrayGenUniforms["tInput"].value = postprocessing.rtTextureDepth;

    postprocessing.scene.overrideMaterial = postprocessing.materialGodraysGenerate;

    renderer.render(postprocessing.scene, postprocessing.camera, postprocessing.rtTextureGodRays2);

    // pass 2 - render into second ping-pong target

    pass = 2.0;
    stepLen = filterLen * Math.pow(TAPS_PER_PASS, -pass);

    postprocessing.godrayGenUniforms["fStepSize"].value = stepLen;
    postprocessing.godrayGenUniforms["tInput"].value = postprocessing.rtTextureGodRays2;

    renderer.render(postprocessing.scene, postprocessing.camera, postprocessing.rtTextureGodRays1);

    // pass 3 - 1st RT

    pass = 3.0;
    stepLen = filterLen * Math.pow(TAPS_PER_PASS, -pass);

    postprocessing.godrayGenUniforms["fStepSize"].value = stepLen;
    postprocessing.godrayGenUniforms["tInput"].value = postprocessing.rtTextureGodRays1;

    renderer.render(postprocessing.scene, postprocessing.camera, postprocessing.rtTextureGodRays2);

    // final pass - composite god-rays onto colors

    postprocessing.godrayCombineUniforms["tColors"].value = postprocessing.rtTextureColors;
    postprocessing.godrayCombineUniforms["tGodRays"].value = postprocessing.rtTextureGodRays2;

    postprocessing.scene.overrideMaterial = postprocessing.materialGodraysCombine;

    renderer.render(postprocessing.scene, postprocessing.camera);
    postprocessing.scene.overrideMaterial = null;

  } else {

    renderer.clear();
    renderer.render(scene, camera);

  }

}