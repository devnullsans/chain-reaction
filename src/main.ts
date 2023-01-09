import {
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer
} from "three";
import { CustomGridBlock } from "./helpers/CustomGridBlock";
import { CustomGroupedSpears } from "./helpers/CustomGroupedSpears";
import { colors, players, xSize, ySize } from "./helpers/parsequery";
import { resizeRendererToDisplaySize } from "./helpers/responsiveness";
import "./style.css";

let init = true;
let turn = 0;

const plane = new Mesh(
  new PlaneGeometry(1 * xSize, 1 * ySize),
  new MeshBasicMaterial({ visible: false })
);

const segments = new CustomGridBlock(1, xSize, ySize, 1);
segments.material.color.setHex(colors[turn]);

const scene = new Scene();
scene.add(plane);
scene.add(segments);

const CANVAS_ID = "scene";
const canvas: HTMLElement = document.querySelector(`canvas#${CANVAS_ID}`)!;

const dist = 5;
const aspect = canvas.clientWidth / canvas.clientHeight;
let fov = 75;

if (canvas.clientHeight > canvas.clientWidth) {
  fov = 2 * Math.atan(xSize / aspect / (2 * dist)) * (180 / Math.PI);
} else {
  fov = 2 * Math.atan(ySize / (2 * dist)) * (180 / Math.PI);
}

const camera = new PerspectiveCamera(fov, aspect, 4, 7);
camera.position.z = dist + 1;

const renderer = new WebGLRenderer({ canvas: canvas });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const render = () => {
  if (resizeRendererToDisplaySize(renderer)) {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  for (const object of objects) {
    if (object.vanish) {
      object.doTranslates();
    } else {
      object.doRotate();
    }
  }
  renderer.render(scene, camera);
};

renderer.setAnimationLoop(render);

const raycaster = new Raycaster();

let clicked = false;

const clickHandler = (e: MouseEvent) => {
  if (clicked) return;

  const mousePosition = new Vector2(
    (e.clientX / canvas.clientWidth) * 2 - 1,
    -(e.clientY / canvas.clientHeight) * 2 + 1
  );

  raycaster.setFromCamera(mousePosition, camera);
  const intersect = raycaster.intersectObject(plane).pop();

  if (intersect) {
    const position = new Vector3();
    position.copy(intersect.point).floor().addScalar(0.5);
    position.z = 0;

    const exist = objects.find((obj) => obj.position.equals(position));

    if (exist && (exist.turn < 0 || exist.turn === turn)) {
      clicked = true;
      CustomGroupedSpears.reactions.push(exist);
      CustomGroupedSpears.startReaction(turn).then(() => {
        if (init) {
          turn = (turn + 1) % players;
          segments.material.color.setHex(colors[turn]);
          if (turn === 0) init = false;
        } else {
          const prevTurn = turn;
          turn = (turn + 1) % players;
          while (!objects.some((o) => o.turn === turn)) turn = (turn + 1) % players;
          segments.material.color.setHex(colors[turn]);
          if (turn === prevTurn) canvas.removeEventListener("click", clickHandler);
        }
        clicked = false;
      });
    }
  }
};

canvas.addEventListener("click", clickHandler);

const objects: CustomGroupedSpears[] = [];

const xs = xSize / 2 - 0.5;
const ys = ySize / 2 - 0.5;
for (let i = 0; i < xSize; i++) {
  for (let j = 0; j < ySize; j++) {
    const group = new CustomGroupedSpears(
      (i === 0 && j === 0) ||
      (j === 0 && i + 1 === xSize) ||
      (i === 0 && j + 1 === ySize) ||
      (i + 1 === xSize && j + 1 === ySize)
        ? 1
        : i === 0 || j === 0 || i + 1 === xSize || j + 1 === ySize
        ? 2
        : 3
    );
    group.position.set(xs - i, ys - j, 0);
    objects.push(group);
    scene.add(group);
  }
}

for (const object of objects) {
  const { x, y, z } = object.position;
  object.setNeighbours(
    [
      new Vector3(x, y + 1, z),
      new Vector3(x - 1, y, z),
      new Vector3(x + 1, y, z),
      new Vector3(x, y - 1, z)
    ]
      .map((v) => objects.find((o) => o.position.equals(v)))
      .filter((o: CustomGroupedSpears | undefined): o is CustomGroupedSpears => o !== undefined)
  );
}
