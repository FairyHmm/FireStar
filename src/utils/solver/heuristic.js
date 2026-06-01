import { CELL } from "../constants.js";

// Hàm khởi tạo Heuristic đánh giá khoảng cách đến lối thoát
// Ý tưởng tối ưu:
// 1. Quét 4 cạnh biên của bản đồ để tìm các lối ra hợp lệ và lưu tọa độ vào mảng exits
// 2. Tại mỗi ô idx đang xét, hàm tính và trả về Heuristic h(idx) là khoảng cách Manhattan
// ngắn nhất từ ô đó đến lối ra gần nhất

export function createHeuristic(grid, rows, cols) {
  const exits = [];
  
  // 1. Quét hàng trên cùng và dưới cùng
  for (let c = 0; c < cols; c++) {
    if (!(grid[c] & CELL.WALL)) exits.push(c); 
    const bottomIdx = (rows - 1) * cols + c;
    if (!(grid[bottomIdx] & CELL.WALL)) exits.push(bottomIdx);
  }
  
  // 2. Quét cột trái và cột phải (bỏ qua 4 góc)
  for (let r = 1; r < rows - 1; r++) {
    const leftIdx = r * cols;
    if (!(grid[leftIdx] & CELL.WALL)) exits.push(leftIdx); 
    const rightIdx = r * cols + cols - 1;
    if (!(grid[rightIdx] & CELL.WALL)) exits.push(rightIdx);
  }

  // 3. Trả về hàm getH để thuật toán A* sử dụng
  return function getH(idx) {
    if (exits.length === 0) return 0;

    const r1 = Math.floor(idx / cols);
    const c1 = idx % cols;
    let minD = 2e9;

    for (let i = 0; i < exits.length; i++) {
      const exitIdx = exits[i];
      const r2 = Math.floor(exitIdx / cols);
      const c2 = exitIdx % cols;
      
      // Khoảng cách Manhattan
      const d = Math.abs(r1 - r2) + Math.abs(c1 - c2); 
      if (d < minD) minD = d;
    }
    
    return minD;
  };
}