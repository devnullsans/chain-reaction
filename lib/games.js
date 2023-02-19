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

export class Game {
  // TODO Seperate all socket.send(...) logics into there own functions
  constructor(id, totalPlayer, visible) {
    // id will be base 36 of creator user google sub
    this.id = id;
    this.visible = visible;

    this.turn = -1;
    this.players = [];
    this.initial = false;

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

        // TODO maybe id is not required to be stored with the cell as it will be the map key
        this.grid.set(id, new Cell(id, limit, adjacent));
      }
    }

    this.gameInt = setInterval(() => {
      if (this.players.length === 0) {
        rooms.delete(this.id);
        clearInterval(this.gameInt);
        console.log(`Game ${this.id} has no players hence removed.`);
      }
    }, 3e4);
  }

  isFull() {
    return this.players.length === this.totalPlayer;
  }

  playersUpdate() {
    const message = JSON.stringify({
      type: "players-update",
      payload: {
        total: this.totalPlayer,
        players: this.players.map((socket) => {
          const { name, picture } = socket.user;
          return { name, picture };
        })
      }
    });
    for (const socket of this.players) {
      if (socket.readyState === socket.OPEN) socket.send(message);
    }
  }

  playerLeft(e) {
    e.target.close();
    if (!this.isFull()) {
      this.players.splice(this.players.indexOf(e.target), 1);
      this.playersUpdate();
    } else {
      const playerIndex = this.players.indexOf(e.target);
      if (playerIndex !== -1) {
        this.players[playerIndex] = null;
        if (this.turn === playerIndex) {
          clearTimeout(this.gameInt);
          this.sendNextTurn();
        }
      }
    }
  }

  validateTurn(e) {
    console.log(e);
    const playerIndex = this.players.indexOf(e.target);
    if (playerIndex === this.turn) {
      try {
        // TODO data could be binary untill set explicitly
        const { move } = JSON.parse(e.data);
        if (this.grid.has(move)) {
          const cell = this.grid.get(move);
          if (cell.own === -1 || cell.own === playerIndex) {
            // its a valid move
            clearTimeout(this.gameInt);
            const message = JSON.stringify({
              type: "play-turn",
              payload: { player: playerIndex, move }
            });
            for (const socket of this.players) {
              if (socket && socket.readyState === socket.OPEN) socket.send(message);
            }
            this.checkNextTurn();
          }
        }
      } catch (error) {}
    }
  }

  addPlayer(user, socket) {
    socket.user = user;
    socket.addEventListener("close", (e) => this.playerLeft(e), { once: true });
    socket.addEventListener("message", (e) => this.validateTurn(e));
    this.players.push(socket);
    this.playersUpdate();
    if (this.isFull()) {
      // TODO async add stats to all profiles
      clearInterval(this.gameInt);
      this.checkNextTurn();
    }
  }

  checkNextTurn() {
    this.turn = (this.turn + 1) % this.totalPlayer;

    if (this.initial) {
      const winner = this.players.findIndex((_, index) => {
        for (const cell of this.grid.values()) {
          if (cell.own !== -1 && cell.own !== index) {
            return false;
          }
        }
        return true;
      });

      if (winner < 0) {
        let canPlay = false;
        for (const cell of this.grid.values()) {
          if (cell.own === this.turn) {
            canPlay = true;
            break;
          }
        }

        if (canPlay) this.sendNextTurn();
        else this.checkNextTurn();
      } else {
        // someone has won the game
        const message = JSON.stringify({
          type: "won-game",
          payload: { player: winner }
        });
        for (const socket of this.players) {
          if (socket && socket.readyState === socket.OPEN) {
            socket.send(message);
            socket.close();
          }
        }
        // TODO async request update winner in db
        rooms.delete(this.id);
        console.log(`Game ${this.id} has been won by player ${winner} hence removed.`);
      }
    } else {
      if (this.turn + 1 === this.totalPlayer) {
        this.initial = true;
      }
      this.sendNextTurn();
    }
  }

  sendNextTurn() {
    const player = this.players[this.turn];
    if (player) {
      const message = JSON.stringify({
        type: "set-turn",
        payload: { player: next }
      });
      for (const socket of this.players) {
        if (socket && socket.readyState === socket.OPEN) socket.send(message);
      }
      this.gameInt = setTimeout(() => this.checkNextTurn(), 3e4);
    } else {
      const allPlayersLeft = this.players.every((p) => p === null);

      if (allPlayersLeft) {
        rooms.delete(this.id);
        console.log(`Game ${this.id} all players left hence removed.`);
      } else {
        const message = JSON.stringify({
          type: "reset-turn",
          payload: { player: next }
        });
        for (const socket of this.players) {
          if (socket && socket.readyState === socket.OPEN) socket.send(message);
        }
        this.checkNextTurn();
      }
    }
  }
}

// const cell = {
//   adjacent: [cell, ...[2, 3, 4]],
//   own: -1 - 7,
//   mass: 0 - 3,
//   limit: 1 - 3,
//   id: "x-y" // 0:0...0:7...5:0...5:7 for 6x8 grid
// };

class Cell {
  constructor(id, limit, adjacent) {
    this.own = -1;
    this.mass = 0;
    // TODO maybe id is not needed to be stored with the cell as it will be the grid key
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
