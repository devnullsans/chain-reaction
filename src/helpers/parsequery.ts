let players = 2;
let xSize = 6;
let ySize = 8;

const params = new URLSearchParams(location.search);

if (params.has("p")) {
  const p = parseInt(params.get("p")!);
  if (!isNaN(p) && p > 2 && p < 9) {
    players = p;
    switch (p) {
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
    }
  }
}

const colors = [0xff0e0e, 0x00ff16, 0x2900ff, 0xfaff20, 0xff8f00, 0xfd00ff, 0xffffff, 0x03ffd3]; // g,b,r,y,o,p,w,c

export { colors, players, xSize, ySize };
