export function tracePath(trace, startIdx, endIdx) {
    const path = [];
    let cur = endIdx;
    while (cur !== startIdx) {
        path.push(cur);
        cur = trace[cur];
    }
    path.push(startIdx);
    return path.reverse();
}