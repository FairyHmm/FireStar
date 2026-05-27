export const DR = [-1, +1, 0, 0];
export const DC = [0, 0, -1, +1];

export function tracePath(trace, startIdx, endIdx) {
  const path = [];
  let cur = endIdx;
  while (cur !== -1 && cur !== startIdx) {
    path.push(cur);
    cur = trace[cur];
  }
  path.push(startIdx);
  return path.reverse();
}

export function isSafeFromFire(humanTime, fireDist, fireRate) {
  const fireArrival = fireDist * fireRate;
  return humanTime < fireArrival;
}

export function isAtBoundary(r, c, rows, cols) {
  return r === 0 || r === rows - 1 || c === 0 || c === cols - 1;
}
