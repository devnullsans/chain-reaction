import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { CustomGridBlock } from "../helpers/CustomGridBlock";
import { resizeRendererToDisplaySize } from "../helpers/responsiveness";
import "./style.css";

const segments = new CustomGridBlock(0.5, 6, 8, 1);
segments.material.color.setHex(0xffff00);

const scene = new Scene();
scene.add(segments);

// Set the camera position
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 2, 10);
camera.position.z = 5;

// Set up the renderer
const CANVAS_ID = "scene";
const renderer = new WebGLRenderer({
  canvas: document.querySelector(`canvas#${CANVAS_ID}`)!
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// const render = () => {
// requestAnimationFrame(render);

// segments.rotation.y += 0.01;

if (resizeRendererToDisplaySize(renderer)) {
  const canvas = renderer.domElement;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
}

renderer.render(scene, camera);
// };

// render();
