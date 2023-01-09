import { BufferGeometry, Float32BufferAttribute, LineBasicMaterial, LineSegments } from "three";

class CustomGridBlock extends LineSegments<BufferGeometry, LineBasicMaterial> {
  constructor(cellSize = 1, xCells = 2, yCells = 2, zCells = 2, lineColor = 0xffffff) {
    const size = Math.abs(cellSize);
    const xAbs = Math.abs((xCells / 2) * size);
    const yAbs = Math.abs((yCells / 2) * size);
    const zAbs = Math.abs((zCells / 2) * (size / 2));

    const vertices = [];

    for (let k = 0; k <= zCells; k++) {
      const zVar = -zAbs + k * (size / 2);
      for (let i = 0; i <= xCells; i++) {
        const xVar = -xAbs + i * size;
        vertices.push(xVar, -yAbs, zVar, xVar, yAbs, zVar);
      }
      for (let j = 0; j <= yCells; j++) {
        const yVar = -yAbs + j * size;
        vertices.push(-xAbs, yVar, zVar, xAbs, yVar, zVar);
      }
    }

    for (let i = 0; i <= xCells; i++) {
      const xVar = -xAbs + i * cellSize;
      for (let j = 0; j <= yCells; j++) {
        const yVar = -yAbs + j * cellSize;
        vertices.push(xVar, yVar, -zAbs, xVar, yVar, zAbs);
      }
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));

    const material = new LineBasicMaterial({ color: lineColor });

    super(geometry, material);

    this.type = "CustomGridBlock";
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}

export { CustomGridBlock };
