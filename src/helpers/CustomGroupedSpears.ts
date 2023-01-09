import { Group, Mesh, MeshBasicMaterial, SphereGeometry, Vector3 } from "three";
import { colors, players } from "./parsequery";

class CustomGroupedSpears extends Group {
  neighbours: CustomGroupedSpears[];
  rotateVector: Vector3;
  limit: number;
  turn: number;
  vanish: boolean;
  constructor(limit = 3) {
    super();
    this.neighbours = [];
    this.rotateVector = new Vector3();
    this.limit = limit;
    this.turn = -1;
    this.vanish = false;
  }
  setNeighbours(neighbours: CustomGroupedSpears[]) {
    this.neighbours = neighbours;
  }
  setTurn(turn: number) {
    if (this.turn !== turn) {
      this.turn = turn;
      for (const child of this.children) {
        (<Mesh>child).material = CustomGroupedSpears.materials[turn];
      }
    }
  }
  doRotate() {
    const { x, y, z } = this.rotateVector;
    this.rotateX(x);
    this.rotateY(y);
    this.rotateZ(z);
  }
  doTranslates() {
    for (let index = 0; index < this.neighbours.length; index++) {
      const v = new Vector3();
      const { x, y } = v
        .subVectors(this.neighbours[index].position, this.position)
        .normalize()
        .divideScalar(20);
      this.children[index].position.x += x;
      this.children[index].position.y += y;
    }
  }
  addIt(turn: number) {
    return new Promise<void>((resolve) => {
      this.rotateVector.set(
        Math.random() * (Math.PI / 90),
        Math.random() * (Math.PI / 90),
        Math.random() * (Math.PI / 90)
      );
      this.add(new Mesh(CustomGroupedSpears.geometry, CustomGroupedSpears.materials[turn]));
      if (this.children.length > this.limit) {
        CustomGroupedSpears.reactions.push(...this.neighbours);
        this.turn = -1;
        this.vanish = true;
        this.rotation.set(0, 0, 0);
        for (const child of this.children) {
          child.position.set(0, 0, 0);
        }
        setTimeout(() => {
          this.vanish = false;
          while (this.children.length > 0) {
            this.remove(this.children[0]);
          }
          resolve();
        }, 3e2);
      } else {
        switch (this.children.length) {
          case 2:
            {
              const [one, two] = this.children as Array<Mesh>;
              one.position.x -= 0.1;
              two.position.x += 0.1;
            }
            break;
          case 3:
            {
              const [one, two, three] = this.children as Array<Mesh>;
              one.position.x -= 0.05;
              one.position.y -= 0.1;
              two.position.x += 0.05;
              two.position.y -= 0.1;
              three.position.y += 0.1;
            }
            break;
        }
        setTimeout(() => resolve(), 3e1);
      }
    });
  }
  static geometry = new SphereGeometry(0.2, 16, 16);
  static materials = colors.slice(0, players).map((color) => new MeshBasicMaterial({ color }));
  static reactions: CustomGroupedSpears[] = [];
  static async startReaction(turn: number) {
    for (let cell = this.reactions.shift(); cell !== undefined; cell = this.reactions.shift()) {
      cell.setTurn(turn);
      await cell.addIt(turn);
    }
  }
}

export { CustomGroupedSpears };
