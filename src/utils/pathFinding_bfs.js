/**
 * Thuật toán tìm đường sinh tồn (sử dụng BFS)
 * Đầu vào: 
 * - grid: mảng bản đồ (0: Trống, 1: Tường)
 * - startIdx: Index 1D vị trí xuất phát của nhân vật
 * - fireTime: bản đồ lửa lan lấy từ hàm fireSpread_bfs
 * Đầu ra: Mảng các index 1D tạo thành đường đi hoàn chỉnh, hoặc null nếu kẹt.
 */

const dr = [-1, +1, 0, 0];
const dc = [0, 0, -1, +1];

export function findPath_bfs(grid, rows, cols, startIdx, fireTime) {
    const size = rows * cols;
    const gScore = new Int32Array(size).fill(Infinity);
    const trace = new Int32Array(size).fill(-1);
    const queue = [];
    let head = 0;
    gScore[startIdx] = 0;
    queue.push(startIdx);

    while (head < queue.length) {
        const cur = queue[head++];
        const r = Math.floor(cur / cols);
        const c = cur % cols;

        if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1)
            return tracePath(trace, startIdx, cur);
        // Điều kiện chiến thắng: đã đứng ở bất kỳ ô trống nào ở rìa của bản đồ

        for (let i = 0; i < 4; i++) {
            const nr = r + dr[i];
            const nc = c + dc[i];
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols)
                continue;
            const next = nr * cols + nc;
            if (grid[next] === 1)
                continue;
            if (gScore[next] === Infinity && gScore[cur] + 1 < fireTime[next]) {
                gScore[next] = gScore[cur] + 1;
                trace[next] = cur;
                queue.push(next);
            }
        }
    }
    return null;
}

function tracePath(trace, startIdx, endIdx) {
    const path = [];
    let cur = endIdx;
    while (cur !== startIdx) {
        path.push(cur);
        cur = trace[cur];
    }
    path.push(startIdx);
    return path.reverse();
}