 var camera, scene, renderer;
 var geometry, material, mesh;

 var A, B;
 var list = [];

 init();
 animate();

 function init() {

   camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
   camera.position.z = 100;
   camera.position.y = 10;
   camera.position.x = 30;

   scene = new THREE.Scene();

   material = new THREE.LineBasicMaterial({
     color: 0xff0000
   });
   geometry = new THREE.Geometry();
   geometry.vertices.push(
     new THREE.Vector3(0, 0, 0),
     new THREE.Vector3(10000, 0, 0)
   );
   var line = new THREE.Line(geometry, material);
   scene.add(line);

   material = new THREE.LineBasicMaterial({
     color: 0xff0000
   });

   material = new THREE.LineBasicMaterial({
     color: 0x00ff00
   });
   geometry = new THREE.Geometry();
   geometry.vertices.push(
     new THREE.Vector3(0, 0, 0),
     new THREE.Vector3(0, 10000, 0)
   );

   line = new THREE.Line(geometry, material);
   scene.add(line);

   material = new THREE.LineBasicMaterial({
     color: 0x0000ff
   });
   geometry = new THREE.Geometry();
   geometry.vertices.push(
     new THREE.Vector3(0, 0, 0),
     new THREE.Vector3(0, 0, 10000)
   );

   line = new THREE.Line(geometry, material);
   scene.add(line);

   A = new FuckingCube(0xDA4952);
   A.mesh.position.x = -40;

   B = new FuckingCube(0x752763);
   B.mesh.position.x = 40;

   renderer = new THREE.CanvasRenderer();
   renderer.setSize(window.innerWidth, window.innerHeight);

   document.body.appendChild(renderer.domElement);
   window.addEventListener('resize', onWindowResize, false);

 }

 function onWindowResize() {

   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();

   renderer.setSize(window.innerWidth, window.innerHeight);

 }

 function animate() {

   // note: three.js includes requestAnimationFrame shim
   requestAnimationFrame(animate);

   //mesh.rotation.x += 0.01;
   //mesh.rotation.y += 0.02;
   //A.update(function () {
   //A.mesh.position.z--;
   //A.z--;
   //});
   if (list.length !== 0) {
     list.forEach(function (f) {
       eval(f);
     });
   }

   renderer.render(scene, camera);

 }