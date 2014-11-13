 function FuckingCube(c) {
   this.geometry = new THREE.BoxGeometry(40, 40, 40);
   this.material = new THREE.MeshBasicMaterial({
     color: c
   });

   this.mesh = new THREE.Mesh(this.geometry, this.material);
   //mesh.position.z = 10;
   scene.add(this.mesh);
 }

 FuckingCube.prototype.x = function () {
   return this.mesh.position.x;
 };

 FuckingCube.prototype.y = function () {
   return this.mesh.position.y;
 };

 FuckingCube.prototype.z = function () {
   return this.mesh.position.z;
 };