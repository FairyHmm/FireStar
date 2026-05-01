import React, { useState, useRef, useEffect } from "react";
import { Stack, Paper, Group } from "@mantine/core";
import Canvas from "../Canvas";
import Toolbar from "../Toolbar";
import SimControls from "../tools/SimControls";
import SpeedSlider from "../tools/SpeedSlider";
import PathAlgoSelect from "../tools/PathAlgoSelect";
import { CELL } from "../../utils/constants";
import { fireSpread_bfs } from "../../utils/fireSpreading_bfs";
import { findPath_bfs } from "../../utils/pathFinding_bfs";

export default function SimulationMode({ mazeData, setMazeData }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [speed, setSpeed] = useState(100);

  // State lưu thuật toán đang được chọn (mặc định là bfs)
  const [pathAlgo, setPathAlgo] = useState("bfs");

  // Các Ref để lưu trữ dữ liệu "vô hình" (không gây re-render)
  const originalGridRef = useRef(null); // Lưu bản đồ gốc trước khi cháy
  const simDataRef = useRef({ fireTime: null, path: null }); // Lưu kết quả BFS
  const tickRef = useRef(0); // Bộ đếm thời gian (bước chạy)

  // Khởi tạo dữ liệu BFS khi bấm Play LẦN ĐẦU TIÊN
  const initSimulation = () => {
    const { grid, w, h } = mazeData;
    const size = w * h;
    const fireStarts = [];
    let personStart = -1;

    // Quét bản đồ tìm Người và Lửa
    for (let i = 0; i < size; i++) {
      if (grid[i] & CELL.FIRE_CURRENT) fireStarts.push(i);
      if (grid[i] & CELL.PERSON) personStart = i;
    }

    if (personStart === -1) {
      alert("Sếp quên đặt nhân vật vào map rồi!");
      return false;
    }

    // Tính toán thời gian lửa lan
    const fireTime = fireSpread_bfs(grid, h, w, fireStarts);
    // KHAI BÁO BẰNG LET ĐỂ CÓ THỂ THAY ĐỔI ĐƯỢC
    let path = null;
    // Quyết định chạy thuật toán nào dựa vào state `pathAlgo`
    if (pathAlgo === "bfs") {
      path = pathFinding_bfs(grid, h, w, personStart, fireTime);
    } else if (pathAlgo === "astar") {
      alert("A* đang cập nhật");
      return false;
    } else {
      alert("Đang cập nhật");
      return false;
    }
    // Lưu lại bản sao gốc và kết quả thuật toán
    originalGridRef.current = new Uint8Array(grid);
    simDataRef.current = { fireTime, path };
    tickRef.current = 0;
    return true;
  };

  // Hàm cập nhật bản đồ theo thời gian thực (Tick)
  const updateFrame = () => {
    const { fireTime, path } = simDataRef.current;
    const currentTick = tickRef.current;
    const w = mazeData.w;
    const h = mazeData.h;

    // Luôn bắt đầu từ bản đồ gốc chưa cháy
    const newGrid = new Uint8Array(originalGridRef.current);

    // 1. Lan Lửa: Ô nào có thời gian cháy <= currentTick thì biến thành Lửa
    for (let i = 0; i < newGrid.length; i++) {
      if (fireTime[i] <= currentTick) {
        newGrid[i] |= CELL.FIRE_CURRENT;
      }
    }

    // 2. Di chuyển Người
    let currentPos = -1;
    if (path) {
      // Nếu có đường sống, đi theo đường đó (dừng lại nếu đã chạy hết đường)
      const pathIndex = Math.min(currentTick, path.length - 1);
      currentPos = path[pathIndex];
    } else {
      // Đứng im chịu trận nếu không có đường
      // (Bạn quét lại map gốc để lấy vị trí đầu tiên của người)
      currentPos = originalGridRef.current.findIndex(
        (val) => val & CELL.PERSON,
      );
    }

    // Xóa vị trí người cũ (nếu nó chưa bị cháy) và vẽ người ở vị trí mới
    for (let i = 0; i < newGrid.length; i++) {
      if (newGrid[i] & CELL.PERSON) newGrid[i] &= ~CELL.TILE;
    }
    // Nếu ô người đứng bị cháy, thì hiển thị Lửa (chết), nếu không thì hiển thị Người
    if (newGrid[currentPos] & CELL.FIRE_CURRENT) {
      newGrid[currentPos] |= CELL.PERSON;
    }

    // Đẩy xuống Canvas để vẽ
    setMazeData((prev) => ({ ...prev, grid: newGrid }));
    tickRef.current++; // Chuyển sang bước tiếp theo
  };

  // Quản lý vòng lặp thời gian
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        updateFrame();
      }, speed);
    } else if (!isPlaying && interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const handlePlayPause = () => {
    // Ép tính toán lại đường đi mới nhất mỗi khi bấm Play từ trạng thái đang dừng
    if (!isPlaying) {
      const isReady = initSimulation();
      if (!isReady) return;
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    tickRef.current = 0;
    if (originalGridRef.current) {
      // Khôi phục bản đồ gốc, vứt đi dữ liệu đã tính
      setMazeData((prev) => ({
        ...prev,
        grid: new Uint8Array(originalGridRef.current),
      }));
      originalGridRef.current = null;
      simDataRef.current = { fireTime: null, path: null };
    }
  };
  return (
    <Stack h="100%" spacing="md" align="center" mt="md">
      <Toolbar>
        <Group gap="md" aligh="center">
          <PathAlgoSelect algo={pathAlgo} setAlgo={setPathAlgo} />
          <SimControls
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onReset={handleReset}
          />
          <SpeedSlider speed={speed} setSpeed={setSpeed} />
        </Group>
      </Toolbar>
      <Canvas
        mazeData={mazeData}
        setMazeData={setMazeData}
        isReadOnly={isReadOnly}
      />
    </Stack>
  );
}
