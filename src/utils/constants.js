export const tileSize = 20;

export const CELL = {
  PERSON:       0b0000_0001,
  WALL:         0b0000_0010,
  TILE:         0b0000_0100,
  EXPLORED:     0b0000_1000,
  FRONTIER:     0b0001_0000,
  PATH:         0b0010_0000,
  FIRE_CURRENT: 0b0100_0000,
  FIRE_NEXT:    0b1000_0000
};

export const COLORS = {
  [CELL.PERSON]:       0x14c741,
  [CELL.WALL]:         0x0f172a,
  [CELL.TILE]:         0xe2e8f0,
  [CELL.EXPLORED]:     0x7dd3fc,
  [CELL.FRONTIER]:     0x2dd4bf,
  [CELL.PATH]:         0x4338ca,
  [CELL.FIRE_CURRENT]: 0xe11d48,
  [CELL.FIRE_NEXT]:    0xfca5a5,
  EXPLORED_FIRE:       0xed3aac,
  PATH_FIRE:           0x892fd2,
};

export const TOOL_COLORS = {
  wall:   0x334155,
  tile:   0x94a3b8,
  person: 0x14c741,
  fire:   0xe11d48,
};

export const getColor = (val) => {
  if ((val & CELL.PATH) && (val & CELL.FIRE_CURRENT))
    return COLORS.PATH_FIRE;
  if ((val & CELL.EXPLORED) && (val & CELL.FIRE_CURRENT))
    return COLORS.EXPLORED_FIRE;
  if (val & CELL.PERSON)
    return COLORS[CELL.PERSON];
  if (val & CELL.PATH)
    return COLORS[CELL.PATH];
  if (val & CELL.EXPLORED)
    return COLORS[CELL.EXPLORED];
  if (val & CELL.FRONTIER)
    return COLORS[CELL.FRONTIER];
  if (val & CELL.FIRE_CURRENT)
    return COLORS[CELL.FIRE_CURRENT];
  if (val & CELL.FIRE_NEXT)
    return COLORS[CELL.FIRE_NEXT];
  if (val & CELL.WALL)
    return COLORS[CELL.WALL];
  return COLORS[CELL.TILE];
};

export const DIRS = [
  [-2, 0], // Up
  [2,  0], // Down
  [0, -2], // Left
  [0,  2], // Right
];
