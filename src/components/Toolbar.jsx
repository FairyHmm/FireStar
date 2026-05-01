import { Group } from '@mantine/core';

export default function Toolbar({ children }) {
  return (
    <Group p="sm" style={{ backgroundColor: '#2C2E33', borderRadius: '8px' }}>
      {children}
    </Group>
  );
}