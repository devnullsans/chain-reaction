import { Vector3 } from "three";
import "./style.css";

// const plane = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ visible: false }));

// const segments = new CustomGridBlock(1, 1, 1, 1);
// segments.material.color.setHex(0xff0e0e);

// const object = new Group();
// object.position.set(0.5, 0.5, 0);
// const rotate = new Vector3();
// let vanish = false;

// const scene = new Scene();
// scene.add(plane);
// scene.add(segments);
// scene.add(object);

// const CANVAS_ID = "scene";
// const canvas: HTMLElement = document.querySelector(`canvas#${CANVAS_ID}`)!;

// const camera = new PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 2, 12);
// camera.position.z = 7;

// const controls = new OrbitControls(camera, canvas);
// controls.update();

// const renderer = new WebGLRenderer({ canvas: canvas });
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// const render = () => {
//   if (resizeRendererToDisplaySize(renderer)) {
//     camera.aspect = canvas.clientWidth / canvas.clientHeight;
//     camera.updateProjectionMatrix();
//   }
//   if (vanish) {
//     object.rotation.set(0, 0, 0); //
//     const [one, two, three, four] = object.children;
//     one.translateY(0.1);
//     two.translateX(-0.1);
//     three.translateX(0.1);
//     four.translateY(-0.1);
//   } else {
//     object.rotateOnAxis(rotate, Math.PI / 180);
//   }
//   renderer.render(scene, camera);
// };

// renderer.setAnimationLoop(render);

// const raycaster = new Raycaster();

// const clickHandler = (e: MouseEvent) => {
//   const mousePosition = new Vector2(
//     (e.clientX / canvas.clientWidth) * 2 - 1,
//     -(e.clientY / canvas.clientHeight) * 2 + 1
//   );

//   raycaster.setFromCamera(mousePosition, camera);
//   const intersect = raycaster.intersectObject(plane).pop();

//   if (intersect) {
//     const position = new Vector3();
//     position.copy(intersect.point);
//     position.floor();
//     position.addScalar(0.5);
//     position.z = 0;
//     console.log(position);
//     addIt();
//   }
// };

// const geometry = new SphereGeometry(0.2, 16, 16);
// const material = new MeshBasicMaterial({ color: 0xff0e0e });

// function addIt() {
//   rotate.set(Math.random(), Math.random(), Math.random());
//   if (object.children.length === 3) {
//     object.add(new Mesh(geometry, material));
//     for (const child of object.children) {
//       child.position.set(0, 0, 0); //
//     }
//     vanish = true;
//     setTimeout(() => {
//       vanish = false;
//       while (object.children.length > 0) {
//         object.remove(object.children[0]);
//       }
//     }, 2e2);
//   } else {
//     object.add(new Mesh(geometry, material));
//     switch (object.children.length) {
//       case 2:
//         {
//           const [one, two] = object.children as Array<Mesh>;
//           one.position.x -= 0.1;
//           two.position.x += 0.1;
//         }
//         break;
//       case 3:
//         {
//           const [one, two, three] = object.children as Array<Mesh>;
//           one.position.x -= 0.05;
//           one.position.y -= 0.1;
//           two.position.x += 0.05;
//           two.position.y -= 0.1;
//           three.position.y += 0.1;
//         }
//         break;
//     }
//   }
// }

// canvas.addEventListener("click", clickHandler);

const v1 = new Vector3(0.5, 0.5, 0);
const v2 = new Vector3(0.5, -0.5, 0);

const vd = new Vector3();

console.log(vd.subVectors(v2, v1).normalize());
