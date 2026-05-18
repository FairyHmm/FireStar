import { CELL } from "../constants";

export const calculateGridAtTick = (plan, tick, w, h) => {
  const { originalGrid, fireDistance, visitedNodesInOrder, path, personStart, fireRate } = plan;
  const newGrid = new Uint8Array(originalGrid);

  let simTime = 0; // Thời gian ảo (độ dài đường đi) 

  // GIAI ĐOẠN 1: Diễn họa thuật toán tìm kiếm (Máy tính đang suy nghĩ)
  if (tick < visitedNodesInOrder.length) {
    simTime = visitedNodesInOrder[tick].d; 

    // Vẽ vùng Explored thuật toán vừa chạm tới
    for (let i = 0; i <= tick; i++) {
      newGrid[visitedNodesInOrder[i].idx] |= CELL.EXPLORED;
    }
    // Giữ người ở nguyên vị trí xuất phát
    newGrid[personStart] |= CELL.PERSON; 
  } 
  // GIAI ĐOẠN 2: Diễn họa bước chạy thoát hiểm thực tế
  else {
    // Luôn vẽ full vùng Explored
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      newGrid[visitedNodesInOrder[i].idx] |= CELL.EXPLORED;
    }

    if (path && path.length > 0) {
      const pathTick = tick - visitedNodesInOrder.length;
      const pathIndex = Math.min(pathTick, path.length - 1);
      
      simTime = pathIndex; // Thời gian ảo lúc này là số bước chân thật sự trên đường thoát

      // Vẽ tia sáng con đường
      for (let i = 0; i <= pathIndex; i++) {
        newGrid[path[i]] |= CELL.PATH;
      }
      // Dịch chuyển nhân vật
      newGrid[path[pathIndex]] |= CELL.PERSON;
    } else {
      // Trường hợp không tìm thấy đường thoát (Chết cháy)
      simTime = visitedNodesInOrder.length > 0 ? visitedNodesInOrder[visitedNodesInOrder.length - 1].d : 0;
      newGrid[personStart] |= CELL.PERSON;
    }
  }

  // --- LOGIC LỬA LAN BÁM THEO SIM-TIME NHƯ BẠN MÔ TẢ ---
  for (let i = 0; i < newGrid.length; i++) {
    // Độ dài đường đi * tốc độ lửa => số ô lửa lan được
    if (fireDistance[i] <= simTime * fireRate) {
      // Lửa cháy đè lên mọi thứ
      newGrid[i] |= CELL.FIRE_CURRENT;
    }
  }

  return newGrid;
};