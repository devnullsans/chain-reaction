export const rooms = new Map();

// const game = {
//   turn: 0,
//   totalPlayer: 2 - 8,
//   players: [ws, ...[2 - 8]],
//   grid: [cell, ...[]],
//   visible: true || false,
//   started: true || false,
//   initial: true || false
// };

// const cell = {
//   adjacent: [cell, ...[2, 3, 4]],
//   own: -1 - 7,
//   mass: 0 - 3,
//   limit: 1 - 3,
//   id: "x-y" // 0:0...0:7...5:0...5:7 for 6x8 grid
// };

// Next create a Player class that incorporates user data, game data, and socket reference

export class Game {
  constructor(id, totalPlayer, visible) {
    this.id = id; // id will be base 36 of creator user google sub
    this.visible = visible;

    this.started = false; // maybe not needed until a specific use case arrives
    this.turn = 0;
    this.initial = false; // maybe required depending on game running stratergy
    this.winner = ""; // maybe required if needed for async db updates
    this.players = []; // creator shall join in a lator request like other players so an empty array
    // thus it can also help deducing started if we compare its length with totalPlayer

    let xSize;
    let ySize;
    this.totalPlayer = totalPlayer;
    switch (totalPlayer) {
      case 3:
      case 4:
        xSize = 8;
        ySize = 10;
        break;
      case 5:
      case 6:
        xSize = 10;
        ySize = 12;
        break;
      case 7:
      case 8:
        xSize = 12;
        ySize = 14;
        break;
      default:
        this.totalPlayer = 2;
        xSize = 6;
        ySize = 8;
        break;
    }

    this.grid = new Map();
    for (let x = 0; x < xSize; x++) {
      for (let y = 0; y < ySize; y++) {
        const id = `${x}-${y}`;

        const xZero = x === 0;
        const yZero = y === 0;
        const xMaxx = x + 1 === xSize;
        const yMaxx = y + 1 === ySize;

        const xZeroyZero = xZero && yZero;
        const xZeroyMaxx = xZero && yMaxx;
        const xMaxxyZero = xMaxx && yZero;
        const xMaxxyMaxx = xMaxx && yMaxx;

        const isCorner = xZeroyZero || xZeroyMaxx || xMaxxyZero || xMaxxyMaxx;
        const isEdge = xZero || yZero || xMaxx || yMaxx;
        const limit = isCorner ? 1 : isEdge ? 2 : 3;

        const xmm = x - 1;
        const xpp = x + 1;
        const ymm = y - 1;
        const ypp = y + 1;
        const adjacent = [];
        if (isCorner) {
          if (xZeroyZero) {
            adjacent.push(`${x}-${ypp}`, `${xpp}-${y}`);
          } else if (xZeroyMaxx) {
            adjacent.push(`${x}-${ymm}`, `${xpp}-${y}`);
          } else if (xMaxxyZero) {
            adjacent.push(`${x}-${ypp}`, `${xmm}-${y}`);
          } else if (xMaxxyMaxx) {
            adjacent.push(`${x}-${ymm}`, `${xmm}-${y}`);
          }
        } else if (isEdge) {
          if (xZero) {
            adjacent.push(`${x}-${ymm}`, `${x}-${ypp}`, `${xpp}-${y}`);
          } else if (yZero) {
            adjacent.push(`${xmm}-${y}`, `${xpp}-${y}`, `${x}-${ypp}`);
          } else if (xMaxx) {
            adjacent.push(`${x}-${ypp}`, `${x}-${ymm}`, `${xmm}-${y}`);
          } else if (yMaxx) {
            adjacent.push(`${xpp}-${y}`, `${xmm}-${y}`, `${x}-${ymm}`);
          }
        } else {
          adjacent.push(`${x}-${ypp}`, `${xmm}-${y}`, `${xpp}-${y}`, `${x}-${ymm}`);
        }

        // maybe id is not required to be stored with the cell as it will be the map key
        this.grid.set(id, new Cell(id, limit, adjacent));
      }
    }

    // clear this interval when totalPlayer === players.length OR started === true
    this.iid = setInterval(() => {
      if (this.players.length === 0) rooms.delete(this.id);
    }, 6e3);
  }

  // more methods shall be added later
}

class Cell {
  constructor(id, limit, adjacent) {
    this.own = -1;
    this.mass = 0;
    // maybe id is not needed to be stored with the cell as it will be the grid key
    this.id = id;
    this.limit = limit;
    this.adjacent = adjacent;
  }

  addMass(turn) {
    const exploded = this.mass === this.limit;
    if (exploded) {
      this.own = -1;
      this.mass = 0;
    } else {
      this.own = turn;
      this.mass++;
    }
    return exploded;
  }
}
