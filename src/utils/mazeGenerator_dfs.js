/**
 * Tối ưu hóa bộ nhớ: Trải phẳng ma trận 2D thành mảng 1D (Uint8Array)
 * Quy ước giá trị: 1 = Tường (#), 0 = Đường đi (.)
 */
export function mazeGenerator_dfs(rows, cols) {
    const size = rows * cols;
    const grid = new Uint8Array(size).fill(1); // khởi tạo bản đồ ban đầu toàn là Tường (1)
    const getIdx = (r, c) => r * cols + c; // chuyển đổi tọa độ 2D (hàng, cột) sang chỉ số 1D
    const stack = [];

    let startR = Math.floor(Math.random() * (rows / 2)) * 2 + 1;
    let startC = Math.floor(Math.random() * (cols / 2)) * 2 + 1;
    // tọa độ bắt đầu phải luôn là số lẻ để khi đục tường, ta luôn chừa lại được các viền tường chẵn, tránh việc các đường đi bị dính liền vào nhau.
 
    if (startR >= rows) startR = rows - 2;
    if (startC >= cols) startC = cols - 2;

    grid[getIdx(startR, startC)] = 0;
    stack.push({ r: startR, c: startC });

    const dr = [-2, +2, 0, 0]; 
    const dc = [0, 0, -2, +2];   // bước nhảy là 2 ô để đục xuyên qua 1 bức tường ở giữa

    while (stack.length > 0) {
        const cur = stack[stack.length - 1];
        const nei = [];
        for (let i = 0; i < 4; i++) {
            const nr = cur.r + dr[i];
            const nc = cur.c + dc[i];
            if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1)
                if (grid[getIdx(nr, nc)] === 1) 
                    nei.push({ r: nr, c: nc, direct: i });
        }
        if (nei.length > 0) {
            const next = nei[Math.floor(Math.random() * nei.length)]; // chọn ngẫu nhiên 1 hướng để đi
            const wallR = cur.r + dr[next.direct]/2;
            const wallC = cur.c + dc[next.direct]/2; // toạ độ nằm giữa ô hiện tại và ô neighbour
            grid[getIdx(wallR, wallC)] = 0; // phá ô ở giữa
            grid[getIdx(next.r, next.c)] = 0; // phá ô neighbour
            stack.push({ r: next.r, c: next.c }); // thêm ô neighbour vào stack để tiếp tục dfs
        } 
    else 
        stack.pop();
    }
    return grid;
}

// ==========================================
// CHẠY THỬ VÀ IN RA TERMINAL CÓ GIAO DIỆN
// ==========================================

// const ROWS = 21; // Luôn dùng số lẻ
// const COLS = 41; // Luôn dùng số lẻ

// const myMaze = mazeGenerator_dfs(ROWS, COLS);

// console.log("\n" + "=".repeat(COLS * 2) + "\n");
// console.log(" MÊ CUNG SINH BẰNG DFS (KÍCH THƯỚC: " + ROWS + "x" + COLS + ")");
// console.log("\n" + "=".repeat(COLS * 2) + "\n");

// // Định nghĩa "Giao diện" Terminal
// const WALL_CHAR = "██"; 
// const PATH_CHAR = "  "; 

// for (let r = 0; r < ROWS; r++) {
//     let rowStr = "";
//     for (let c = 0; c < COLS; c++) {
//         const idx = r * COLS + c;
//         if (myMaze[idx] === 1) {
//             rowStr += WALL_CHAR; // Vẽ khối tường
//         } else {
//             rowStr += PATH_CHAR; // Để lại khoảng trống lối đi
//         }
//     }
//     console.log(rowStr);
// }

// console.log("\n" + "=".repeat(COLS * 2) + "\n");