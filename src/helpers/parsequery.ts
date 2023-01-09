let players = 2;
let xSize = 6;
let ySize = 8;

const params = new URLSearchParams(location.search);

if (params.has("p")) {
  const p = parseInt(params.get("p")!);
  if (!isNaN(p) && p > 1 && p < 9) {
    players = p;
    xSize = p > 6 ? 12 : p > 4 ? 9 : 6;
    ySize = p > 6 ? 16 : p > 4 ? 12 : 8;
  }
}

// 4 * 1.5 = 6
// 4 * 2.0 = 8

// 6 * 1.5 = 9
// 6 * 2.0 = 12

// 8 * 1.5 = 12
// 8 * 2.0 = 16

const colors = [0xff0e0e, 0x00ff16, 0x2900ff, 0xfaff20, 0xff8f00, 0xfd00ff, 0xffffff, 0x03ffd3]; // g,b,r,y,o,p,w,c

export { colors, players, xSize, ySize };
