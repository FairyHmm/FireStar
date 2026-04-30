/**
 * Thuật toán mô phỏng Lửa lan
 * Đầu vào:
 * - grid: Mảng bản đồ (0: Trống, 1: Tường)
 * - fireStarts: Mảng chứa các index (1D) của các điểm bắt đầu cháy
 * Đầu ra: Ma trận thời gian (Int32Array) ghi lại số bước lửa lan tới từng ô
 */

import { CELL } from './constants.js';

const dr = [-1, +1, 0, 0];
const dc = [0, 0, -1, +1];

export function fireSpread_bfs(grid, rows, cols, fireStarts) {
    const size = rows * cols;
    const fireTime = new Int32Array(size).fill(Infinity);
    const queue = [];
    let head = 0;
    for (let i = 0; i < fireStarts.length; i++) {
        const idx = fireStarts[i];
        fireTime[idx] = 0; // quy ước địa điểm bắt đầu có cháy là thời điểm 0
        queue.push(idx);
    }
    while (head < queue.length) {
        const cur = queue[head++];
        const r = Math.floor(cur / cols);
        const c = cur % cols;
        for (let i = 0; i < 4; i++) {
            const nr = r + dr[i];
            const nc = c + dc[i];
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols)
                continue;
            const next = nr * cols + nc;
            const isPassableForFire = (grid[next] === CELL.TILE || grid[next] === CELL.PERSON);
            if (isPassableForFire && fireTime[next] === Infinity) {
                fireTime[next] = fireTime[cur] + 1;
                queue.push(next);
            }
        }
    }
    return fireTime;
}
