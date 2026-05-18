import { CELL } from "../constants";

export const calculateGridAtTick = (plan, tick, w, h) => {
  const { originalGrid, fireDistance, visitedNodesInOrder, path, personStart, fireRate } = plan;
  const newGrid = new Uint8Array(originalGrid);

  let simTime = 0; // Thời gian ảo (để tính lửa lan)

  // GIAI ĐOẠN 1: Máy tính đang "suy nghĩ" thuật toán
  if (tick < visitedNodesInOrder.length) {
    // Trong lúc thuật toán đang quét, thời gian thực chưa trôi qua, lửa đóng băng!
    simTime = 0; 

    // Vẽ vùng Explored (màu xanh)
    for (let i = 0; i <= tick; i++) {
      newGrid[visitedNodesInOrder[i].idx] |= CELL.EXPLORED;
    }
    newGrid[personStart] |= CELL.PERSON; 
  } 
  // GIAI ĐOẠN 2: Thời gian thực bắt đầu trôi, người chạy và lửa lan
  else {
    // Giữ nguyên toàn bộ vùng Explored của AI
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      newGrid[visitedNodesInOrder[i].idx] |= CELL.EXPLORED;
    }

    // Thời gian chạy thực tế bắt đầu đếm từ 0 sau khi Giai đoạn 1 kết thúc
    const runTick = tick - visitedNodesInOrder.length;
    simTime = runTick; // Thời gian liên tục tăng vô tận

    if (path && path.length > 0) {
      const pathIndex = Math.min(runTick, path.length - 1);

      // Vẽ tia sáng con đường
      for (let i = 0; i <= pathIndex; i++) {
        newGrid[path[i]] |= CELL.PATH;
      }
      // Dịch chuyển nhân vật
      newGrid[path[pathIndex]] |= CELL.PERSON;
    } else {
      // Trường hợp không tìm thấy đường thoát, người đứng yên 
      // Nhưng thời gian simTime vẫn tăng, khiến lửa tiếp tục nuốt chửng bản đồ
      newGrid[personStart] |= CELL.PERSON;
    }
  }

  // --- LOGIC LỬA LAN ---
  for (let i = 0; i < newGrid.length; i++) {
    // Lửa bám theo simTime, lan mượt mà và không bao giờ bị "giật lùi" nữa
    if (fireDistance[i] <= simTime * fireRate) {
      newGrid[i] |= CELL.FIRE_CURRENT;
    }
  }

  return newGrid;
};