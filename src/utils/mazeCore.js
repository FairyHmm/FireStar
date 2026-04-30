import { CELL } from './constants.js';

// Map 2D sang index 1D
export const getIndex = (x, y, width) => y * width + x;

export function generateRandomMazeDFS(width, height) {
  // Initialize grid with walls
  let grid = new Uint8Array(width * height).fill(CELL.WALL);

  const carve = (x, y) => {
    // Remove wall, set as tile
    grid[getIndex(x, y, width)] = CELL.TILE;

    const dirs = [
      { dx: 0, dy: -2 }, { dx: 0, dy: 2 },
      { dx: -2, dy: 0 }, { dx: 2, dy: 0 }
    ];

    dirs.sort(() => Math.random() - 0.5);

    for (let { dx, dy } of dirs) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx > 0 && nx < width - 1 && ny > 0 && ny < height - 1) {
        if (!(grid[getIndex(nx, ny, width)] & CELL.TILE)) {
          // Remove wall between current and next cell, set as tile
          grid[getIndex(x + dx / 2, y + dy / 2, width)] = CELL.TILE;
          carve(nx, ny);
        }
      }
    }
  };

  // Bắt đầu đào từ (1,1)
  carve(1, 1);

  // Tạo lối ra ngẫu nhiên
  // Thu thập các vị trí viền mà ô liền kề bên trong là đường đi
  const possibleExits = [];

  // Quét viền trên và dưới (nhảy bước 2 để đúng nhịp grid của DFS)
  for (let x = 1; x < width - 1; x += 2) {
    if (grid[getIndex(x, 1, width)] & CELL.TILE) possibleExits.push({ x, y: 0 });
    if (grid[getIndex(x, height - 2, width)] & CELL.TILE) possibleExits.push({ x, y: height - 1 });
  }
  // Quét viền trái và phải
  for (let y = 1; y < height - 1; y += 2) {
    if (grid[getIndex(1, y, width)] & CELL.TILE) possibleExits.push({ x: 0, y });
    if (grid[getIndex(width - 2, y, width)] & CELL.TILE) possibleExits.push({ x: width - 1, y });
  }

  // Random danh sách ứng viên
  possibleExits.sort(() => Math.random() - 0.5);

  // Gen random 2 - 5 lối ra (có thể chỉnh số lượng tùy ý)
  const numExits = Math.floor(Math.random() * 4) + 2;
  const actualExits = Math.min(numExits, possibleExits.length);

  // Đục tường dựa trên danh sách đã chọn
  for (let i = 0; i < actualExits; i++) {
    const exit = possibleExits[i];
    grid[getIndex(exit.x, exit.y, width)] = CELL.TILE;
  }

  return grid;
}
