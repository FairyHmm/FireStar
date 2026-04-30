import React, { useState } from 'react';
import { Group, Button, Slider, Text, Paper, Stack } from '@mantine/core';
import Canvas from '../Canvas'; 

export default function SimulationMode({ mazeData, setMazeData }) {
    // State quản lý UI
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(100); // Delay giữa mỗi bước (ms/tick)

    // Xử lý sự kiện nút bấm
    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
        // TODO: Gửi tín hiệu sang Canvas (PixiJS Ticker) để bắt đầu/dừng vòng lặp thời gian
    };

    const handleReset = () => {
        setIsPlaying(false);
        // TODO: Xóa lửa, đưa nhân vật về vạch xuất phát, khôi phục map gốc
    };

    return (
        <Stack h="100%" spacing="md">
            {/* BẢNG ĐIỀU KHIỂN */}
            <Paper shadow="sm" p="md" withBorder radius="md">
                <Group position="apart" align="center">
                    <Group>
                        <Button 
                            color={isPlaying ? 'red' : 'teal'} 
                            onClick={handlePlayPause}
                            size="md"
                        >
                            {isPlaying ? '⏸ Tạm dừng' : '▶ Bắt đầu chạy'}
                        </Button>
                        <Button 
                            variant="default" 
                            onClick={handleReset}
                            size="md"
                        >
                            🔄 Đặt lại
                        </Button>
                    </Group>
                    
                    {/* Thanh chỉnh tốc độ mô phỏng */}
                    <Group style={{ width: 350 }}>
                        <Text size="sm" weight={600} color="dimmed">
                            Tốc độ (ms/bước): {speed}ms
                        </Text>
                        <Slider
                            value={speed}
                            onChange={setSpeed}
                            min={10}   // Nhanh nhất
                            max={500}  // Chậm nhất
                            step={10}
                            style={{ flex: 1 }}
                            color="orange"
                            marks={[
                                { value: 10, label: 'Nhanh' },
                                { value: 250, label: 'Thường' },
                                { value: 500, label: 'Chậm' },
                            ]}
                        />
                    </Group>
                </Group>
            </Paper>

            {/* HIỂN THỊ MÊ CUNG */}
            <Paper shadow="sm" p="0" withBorder radius="md" style={{ flex: 1, overflow: 'hidden' }}>
              <Canvas 
                mazeData={mazeData} 
                setMazeData={setMazeData} 
                isReadOnly={true} 
              />
            </Paper>
        </Stack>
    );
}