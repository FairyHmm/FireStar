import { CELL } from "../constants.js";

// Hàm khởi tạo Heuristic đánh giá khoảng cách đến lối thoát
// Ý tưởng tối ưu:
// 1. Quét 4 cạnh biên của bản đồ để tìm các lối ra hợp lệ và lưu tọa độ vào mảng exits
// 2. Tại mỗi ô idx đang xét, hàm tính và trả về Heuristic h(idx) là khoảng cách Manhattan
// ngắn nhất từ ô đó đến lối ra gần nhất

export function createHeuristic(grid, rows, cols) {
  // Tách ra 2 mảng lưu trực tiếp tọa độ R và C để loại bỏ hoàn toàn Math.floor và % trong vòng lặp getH
  const exitR = new Uint8Array(rows * cols);
  const exitC = new Uint8Array(rows * cols);
  let exitCount = 0;

  const addExit = (idx) => {
    exitR[exitCount] = Math.floor(idx / cols);
    exitC[exitCount] = idx % cols;
    exitCount++;
  };

  // 1. Quét hàng trên cùng và dưới cùng
  for (let c = 0; c < cols; c++) {
    if (!(grid[c] & CELL.WALL)) addExit(c);
    const bottomIdx = (rows - 1) * cols + c;
    if (!(grid[bottomIdx] & CELL.WALL)) addExit(bottomIdx);
  }

  // 2. Quét cột trái và cột phải (bỏ qua 4 góc)
  for (let r = 1; r < rows - 1; r++) {
    const leftIdx = r * cols;
    if (!(grid[leftIdx] & CELL.WALL)) addExit(leftIdx);
    const rightIdx = r * cols + cols - 1;
    if (!(grid[rightIdx] & CELL.WALL)) addExit(rightIdx);
  }

  // 3. Trả về hàm getH để thuật toán A* sử dụng
  return function getH(idx) {
    if (exitCount === 0) return 0;

    const r1 = Math.floor(idx / cols);
    const c1 = idx % cols;
    let minD = 0xffff;

    for (let i = 0; i < exitCount; i++) {
      // Khoảng cách Manhattan
      minD = Math.min(minD, Math.abs(r1 - exitR[i]) + Math.abs(c1 - exitC[i]));
    }

    return minD;
  };
}
