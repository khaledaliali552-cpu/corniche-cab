import * as THREE from '../vendor/three.module.min.js';

// الحارات اللي traffic.js محتاجها
export const LANE_X = [-4.5, -1.5, 1.5, 4.5];

export class World {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.buildEnvironment();
  }

  buildEnvironment() {
    // أسفلت الشارع
    const roadGeo = new THREE.PlaneGeometry(14, 3000);
    const roadMat = new THREE.MeshLambertMaterial({ color: 0x2c3437 });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.z = 1000;
    this.group.add(road);

    // خطوط الحارات البيضاء
    for (let x of [-3, 0, 3]) {
      for (let z = 0; z < 2500; z += 15) {
        const lineGeo = new THREE.PlaneGeometry(0.25, 6);
        const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const line = new THREE.Mesh(lineGeo, lineMat);
        line.rotation.x = -Math.PI / 2;
        line.position.set(x, 0.02, z);
        this.group.add(line);
      }
    }

    // بحر الكورنيش
    const seaGeo = new THREE.PlaneGeometry(300, 3000);
    const seaMat = new THREE.MeshLambertMaterial({ color: 0x1b72a8 });
    const sea = new THREE.Mesh(seaGeo, seaMat);
    sea.rotation.x = -Math.PI / 2;
    sea.position.set(160, -0.3, 1000);
    this.group.add(sea);

    // عمارات ومباني إسكندرية
    const bldgColors = [0xdfd2be, 0xc4b397, 0xe8dec8, 0xb8a789];
    for (let z = 0; z < 2500; z += 35) {
      const h = 20 + Math.random() * 25;
      const w = 16 + Math.random() * 8;
      const col = bldgColors[Math.floor(Math.random() * bldgColors.length)];
      const bldgGeo = new THREE.BoxGeometry(w, h, 24);
      const bldgMat = new THREE.MeshLambertMaterial({ color: col });
      const bldg = new THREE.Mesh(bldgGeo, bldgMat);
      bldg.position.set(-20, h / 2, z);
      this.group.add(bldg);
    }
  }

  update(playerZ) {
    if (playerZ > this.group.position.z + 500) {
      this.group.position.z += 500;
    }
  }
}
