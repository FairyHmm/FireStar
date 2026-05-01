import { Button } from '@mantine/core';

export default function GenMapButton({ onClick }) {
  return (
    <Button variant="light" onClick={onClick} leftSection="🎲">
      Gen Map
    </Button>
  );
}