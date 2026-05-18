import { CELL } from "../constants";

export const calculateGridAtTick = (plan, tick, w, h) => {
  const { originalGrid, fireDistance, visitedNodesInOrder, path, personStart, fireRate } = plan;
  const newGrid = new Uint8Array(originalGrid);

  newGrid[personStart] &= ~CELL.PERSON;

  let simTime = 0; 
  let isFinished = false; // Biến báo hiệu kết thúc game
  let status = "running"; // Trạng thái: "running", "won", "lost"

  if (tick < visitedNodesInOrder.length) {
    simTime = 0; 
    for (let i = 0; i <= tick; i++) {
      newGrid[visitedNodesInOrder[i].idx] |= CELL.EXPLORED;
    }
    // Giai đoạn 1: Máy đang tính, người đứng yên ở vạch xuất phát
    newGrid[personStart] |= CELL.PERSON; 
  } 
  else {
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      newGrid[visitedNodesInOrder[i].idx] |= CELL.EXPLORED;
    }

    const runTick = tick - visitedNodesInOrder.length;
    simTime = runTick; 

    if (path && path.length > 0) {
      const pathIndex = Math.min(runTick, path.length - 1);
      
      for (let i = 0; i <= pathIndex; i++) {
        newGrid[path[i]] |= CELL.PATH;
      }
      newGrid[path[pathIndex]] |= CELL.PERSON;

      // NẾU NGƯỜI CHẠY CHẠM ĐÍCH (HẾT MẢNG PATH)
      if (runTick >= path.length - 1) {
        isFinished = true;
        status = "won";
      }
    } else {
      newGrid[personStart] |= CELL.PERSON;
      
      // NẾU KHÔNG CÓ ĐƯỜNG RA (BỊ CHẶN HOẶC CHẾT)
      isFinished = true;
      status = "lost";
      simTime = visitedNodesInOrder.length > 0 ? visitedNodesInOrder[visitedNodesInOrder.length - 1].d : 0;
    }
  }

  for (let i = 0; i < newGrid.length; i++) {
    if (fireDistance[i] <= simTime * fireRate) {
      newGrid[i] |= CELL.FIRE_CURRENT;
    }
  }

  // THAY ĐỔI: Trả về một Object thay vì chỉ trả mảng
  return { newGrid, isFinished, status, simTime };
};