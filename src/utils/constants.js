export const LAYERS = {
  BACKGROUND: 0, // Walls, Empty Tiles
  ALGO: 1,       // Explored, Path, Predictions
  ENTITIES: 2,   // Person, Fire
};

export const CELL = {
  PERSON:       0b00000001,
  WALL:         0b00000010,
  TILE:         0b00000100,
  EXPLORED:     0b00001000,
  FRONTIER:     0b00010000,
  PATH:         0b00100000,
  FIRE_CURRENT: 0b01000000,
  FIRE_NEXT:    0b10000000
};

export const COLORS = {
  [CELL.PERSON]:       0x00ff00,
  [CELL.WALL]:         0x000000,
  [CELL.TILE]:         0xffffff,
  [CELL.EXPLORED]:     0x00ffff,
  [CELL.FRONTIER]:     0xaaffaa,
  [CELL.PATH]:         0x0000ff,
  [CELL.FIRE_CURRENT]: 0xff0000,
  [CELL.FIRE_NEXT]:    0xffaaaa,
};

export const getColor = (val) => {
  if (val & CELL.PERSON)
    return COLORS[CELL.PERSON];
  if (val & CELL.WALL)
    return COLORS[CELL.WALL];
  if (val & CELL.EXPLORED)
    return COLORS[CELL.EXPLORED];
  if (val & CELL.FRONTIER)
    return COLORS[CELL.FRONTIER];
  if (val & CELL.PATH)
    return COLORS[CELL.PATH];
  if (val & CELL.FIRE_CURRENT)
    return COLORS[CELL.FIRE_CURRENT];
  if (val & CELL.FIRE_NEXT)
    return COLORS[CELL.FIRE_NEXT];
  return COLORS[CELL.TILE];
};
