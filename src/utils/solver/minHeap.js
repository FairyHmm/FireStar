export class MinHeap {
  constructor() {
    this.data = [];
  }

  push(idx, fScore) {
    this.data.push({ idx, fScore });
    this.up(this.data.length - 1);
  }

  pop() {
    if (this.data.length === 0) return null;
    const top = this.data[0];
    const bottom = this.data.pop();
    if (this.data.length > 0) {
      this.data[0] = bottom;
      this.down(0);
    }
    return top.idx;
  }

  up(i) {
    while (i > 0) {
      const p = (i - 1) >> 1; 
      if (this.data[p].fScore <= this.data[i].fScore) break;
      const tmp = this.data[i];
      this.data[i] = this.data[p];
      this.data[p] = tmp;
      i = p;
    }
  }

  down(i) {
    const len = this.data.length;
    while ((i << 1) + 1 < len) {
      let left = (i << 1) + 1;
      let right = left + 1;
      let minIdx = (right < len && this.data[right].fScore < this.data[left].fScore) ? right : left;
      
      if (this.data[i].fScore <= this.data[minIdx].fScore) break;
      
      const tmp = this.data[i];
      this.data[i] = this.data[minIdx];
      this.data[minIdx] = tmp;
      i = minIdx;
    }
  }

  isEmpty() {
    return this.data.length === 0;
  }
}