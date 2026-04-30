import React, { useState, useRef, useEffect } from 'react';
import { Group, Button, Slider, Text, Paper, Stack } from '@mantine/core';
import Canvas from '../Canvas'; 
import { FLAGS } from '../../utils/mazeCore';
import { fireSpread_bfs } from '../../utils/fireSpreading_bfs';
import { findPath_bfs } from '../../utils/pathFinding_bfs';

export default function SimulationMode({ mazeData, setMazeData }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(100);
    
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
            if (grid[i] === FLAGS.FIRE_CURRENT) fireStarts.push(i);
            if (grid[i] === FLAGS.PERSON) personStart = i;
        }

        if (personStart === -1) {
            alert("Sếp quên đặt nhân vật vào map rồi!");
            return false;
        }

        // Tính toán thuật toán của Kiên
        const fireTime = fireSpread_bfs(grid, h, w, fireStarts);
        const path = findPath_bfs(grid, h, w, personStart, fireTime);

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
                newGrid[i] = FLAGS.FIRE_CURRENT;
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
            currentPos = originalGridRef.current.indexOf(FLAGS.PERSON);
        }
        
        // Xóa vị trí người cũ (nếu nó chưa bị cháy) và vẽ người ở vị trí mới
        for (let i = 0; i < newGrid.length; i++) {
            if (newGrid[i] === FLAGS.PERSON) newGrid[i] = FLAGS.TILE;
        }
        // Nếu ô người đứng bị cháy, thì hiển thị Lửa (chết), nếu không thì hiển thị Người
        if (newGrid[currentPos] !== FLAGS.FIRE_CURRENT) {
            newGrid[currentPos] = FLAGS.PERSON;
        }

        // Đẩy xuống Canvas để vẽ
        setMazeData(prev => ({ ...prev, grid: newGrid }));
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
        // Nếu chưa có bản đồ gốc (tức là chưa chạy bao giờ), thì khởi tạo
        if (!originalGridRef.current) {
            const isReady = initSimulation();
            if (!isReady) return; // Nếu lỗi (ko có người) thì hủy
        }
        setIsPlaying(!isPlaying);
    };

    const handleReset = () => {
        setIsPlaying(false);
        tickRef.current = 0;
        if (originalGridRef.current) {
            // Khôi phục bản đồ gốc, vứt đi dữ liệu đã tính
            setMazeData(prev => ({ ...prev, grid: new Uint8Array(originalGridRef.current) }));
            originalGridRef.current = null; 
            simDataRef.current = { fireTime: null, path: null };
        }
    };

    return (
        <Stack h="100%" spacing="md">
            <Paper shadow="sm" p="md" withBorder radius="md">
                <Group position="apart" align="center">
                    <Group>
                        <Button 
                            color={isPlaying ? 'red' : 'teal'} 
                            onClick={handlePlayPause} size="md"
                        >
                            {isPlaying ? '⏸ Tạm dừng' : '▶ Bắt đầu chạy'}
                        </Button>
                        <Button variant="default" onClick={handleReset} size="md">
                            🔄 Đặt lại
                        </Button>
                    </Group>
                    
                    <Group style={{ width: 350 }}>
                        <Text size="sm" weight={600} color="dimmed" style={{ width: 170, flexShrink: 0 }}>
                            Tốc độ (ms/bước): {speed}
                        </Text>
                        <Slider
                            value={speed} onChange={setSpeed}
                            min={10} max={500} step={10}
                            style={{ flex: 1 }} color="orange"
                            marks={[
                                { value: 10, label: 'Nhanh' },
                                { value: 250, label: 'Thường' },
                                { value: 500, label: 'Chậm' },
                            ]}
                        />
                    </Group>
                </Group>
            </Paper>

            <Paper shadow="sm" p="0" withBorder radius="md" style={{ flex: 1, overflow: 'hidden' }}>
                <Canvas mazeData={mazeData} setMazeData={setMazeData} isReadOnly={true} /> 
            </Paper>
        </Stack>
    );
}