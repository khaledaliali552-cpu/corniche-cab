import * as THREE from '../vendor/three.module.min.js';

export function buildVehicle(carId = 'taxi_132', colorHex = 0xffffff) {
  const group = new THREE.Group();
  const bodyMat = new THREE.MeshLambertMaterial({ color: colorHex });
  const darkMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
  const glassMat = new THREE.MeshLambertMaterial({ color: 0x334455, transparent: true, opacity: 0.7 });
  const wheelMat = new THREE.MeshLambertMaterial({ color: 0x111111 });

  if (carId === 'microbus') {
    // ميكروباص تويوتا
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.4, 4.4), bodyMat);
    body.position.y = 1.0;
    group.add(body);

    const stripeMat = new THREE.MeshBasicMaterial({ color: 0x0984e3 });
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.25, 4.0), stripeMat);
    stripe.position.y = 0.9;
    group.add(stripe);

    const glass = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.6, 2.8), glassMat);
    glass.position.set(0, 1.35, 0.2);
    group.add(glass);
  } else if (carId === 'toktok') {
    // توكتوك
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.1, 2.2), bodyMat);
    body.position.y = 0.8;
    group.add(body);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.15, 2.22), darkMat);
    roof.position.y = 1.4;
    group.add(roof);
  } else if (carId === 'suzuki_van') {
    // توناية سوزوكي
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.3, 3.2), bodyMat);
    body.position.y = 0.9;
    group.add(body);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.55, 1.5), glassMat);
    cabin.position.set(0, 1.25, 0.4);
    group.add(cabin);
  } else if (carId === 'dabbaba') {
    // دبابة صندوق
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.2, 1.6), bodyMat);
    cabin.position.set(0, 0.95, 1.1);
    group.add(cabin);

    const box = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.4, 2.6), darkMat);
    box.position.set(0, 1.05, -1.0);
    group.add(box);
  } else {
    // تاكسي شاهين إسكندرية
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.75, 3.8), bodyMat);
    body.position.y = 0.65;
    group.add(body);

    const top = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.6, 1.9), glassMat);
    top.position.set(0, 1.15, -0.2);
    group.add(top);

    const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.3), new THREE.MeshBasicMaterial({ color: 0xffcc00 }));
    lamp.position.set(0, 1.55, -0.2);
    group.add(lamp);
  }

  // 4 عجلات
  const wheelGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 12);
  wheelGeom.rotateZ(Math.PI / 2);
  const wheels = [
    [-0.9, 0.35, 1.2], [0.9, 0.35, 1.2],
    [-0.9, 0.35, -1.2], [0.9, 0.35, -1.2]
  ];

  wheels.forEach(([x, y, z]) => {
    const wheel = new THREE.Mesh(wheelGeom, wheelMat);
    wheel.position.set(x, y, z);
    group.add(wheel);
  });

  return group;
}
