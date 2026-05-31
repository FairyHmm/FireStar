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

      // NẾU NGƯỜI CHẠY HẾT ĐƯỜNG (Dù là đường ra ngoài hay đường đi trốn)
      if (runTick >= path.length - 1) {
        if (plan.isWin) {
          // Thật sự thoát ra ngoài an toàn
          isFinished = true;
          status = "won";
        } else {
          // Kịch bản sinh tồn: Chạy đến góc kẹt, đứng chờ lửa tới thiêu
          const currentPos = path[pathIndex];
          const isBurned = fireDistance[currentPos] <= simTime / fireRate;
          
          if (isBurned || simTime > 2000) {
            isFinished = true;
            status = "lost";
          }
        }
      }
    } else {
      newGrid[personStart] |= CELL.PERSON;

      // XÓA TUA NHANH THỜI GIAN: Cho ngọn lửa tiếp tục lan từ từ theo runTick
      const isBurned = fireDistance[personStart] <= simTime / fireRate;
      
      // Chỉ hiện thông báo Lost khi lửa THỰC SỰ đã cháy đến ô người đứng
      // (Hoặc nếu kẹt góc quá lâu > 2000 tick thì cũng tự ngắt để tránh treo trình duyệt)
      if (isBurned || simTime > 2000) {
        isFinished = true;
        status = "lost";
      }
    }
  }

  for (let i = 0; i < newGrid.length; i++) {
    if (fireDistance[i] <= simTime / fireRate) {
      newGrid[i] |= CELL.FIRE_CURRENT;
    }
  }

  // THAY ĐỔI: Trả về một Object thay vì chỉ trả mảng
  return { newGrid, isFinished, status, simTime };
};