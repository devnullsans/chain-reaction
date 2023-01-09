import {
  BoxGeometry,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGLRenderer
} from "three";
import { resizeRendererToDisplaySize } from "../helpers/responsiveness";
import "./style.css";

// Create the cube and sphere geometries
const sphereGeometry = new SphereGeometry(0.2, 16, 16);
const boxGeometry = new BoxGeometry(1, 1, 1);
const edgesGeometry = new EdgesGeometry(boxGeometry);

// Create the material for cube lines and sphere
const whiteLineMaterial = new LineBasicMaterial({ color: 0xffffff });
const redSphereMaterial = new MeshBasicMaterial({ color: 0xff0000 });
const greenSphereMaterial = new MeshBasicMaterial({ color: 0x00ff00 });

// Create the cube and sphere meshes
const cubeOne = new LineSegments(edgesGeometry, whiteLineMaterial);
const sphereOne = new Mesh(sphereGeometry, redSphereMaterial);
const cubeTwo = new LineSegments(edgesGeometry, whiteLineMaterial);
const sphereTwo = new Mesh(sphereGeometry, greenSphereMaterial);

const groupOne = new Group();
groupOne.add(cubeOne);
groupOne.add(sphereOne);

const groupTwo = new Group();
groupTwo.add(cubeTwo);
groupTwo.add(sphereTwo);
groupOne.position.x -= 0.5;
groupTwo.position.x += 0.5;

// Set up the scene to Add the cube and sphere to the scene
const scene = new Scene();
scene.add(groupOne);
scene.add(groupTwo);

// Set the camera position
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Set up the renderer
const CANVAS_ID = "scene";
const renderer = new WebGLRenderer({
  canvas: document.querySelector(`canvas#${CANVAS_ID}`)!
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const render = () => {
  requestAnimationFrame(render);

  // Update the rotation of the sphere
  sphereOne.rotation.x += 0.01;
  sphereTwo.rotation.y += 0.01;

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  // Render the scene
  renderer.render(scene, camera);
};

render();
