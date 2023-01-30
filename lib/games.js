export const rooms = new Map();

const game = {
  turn: 0,
  maxPlayers: 2 - 8,
  players: [ws, ...[2 - 8]],
  cells: [cell, ...[]], // could implement this as map if operations meet requirments
  visible: true || false,
  started: true || false,
  initial: true || false
};

const cell = {
  adjacent: [cell, ...[2, 3, 4]],
  own: -1 - 7,
  mass: 0 - 3,
  limit: 1 - 3,
  id: "x-y" // 0:0...0:7...5:0...5:7 for 6x8 grid
};
