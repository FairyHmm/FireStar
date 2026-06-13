import { useState, useEffect } from "react";
import { Stack, Group, Text, RingProgress } from "@mantine/core";

export default function MetricCard({ metric, isOpened }) {
  const animatedPrimary = useAnimatedValue(metric.primary, isOpened);
  const animatedSecondary = useAnimatedValue(metric.secondaryRaw, isOpened);

  let displaySecondary = metric.secondary;
  if (metric.secondaryRaw !== undefined && metric.secondaryTemplate) {
    displaySecondary = metric.secondaryTemplate(animatedSecondary);
  }

  return (
    <Stack gap={0}>
      <Text fw={700} c="var(--color-text)" ta="center">
        {metric.label}
      </Text>

      {metric.ring != null && (
        <Group justify="center">
          <AnimatedRing
            value={metric.ring}
            color={metric.color}
            isOpened={isOpened}
          />
        </Group>
      )}

      <Group justify="center" gap={6} style={{ whiteSpace: "nowrap" }}>
        <Text fw={800} size="2em" c={metric.color}>
          {animatedPrimary}
        </Text>
        {displaySecondary && (
          <Text fw={500} c="var(--color-text)">
            {displaySecondary}
          </Text>
        )}
      </Group>
    </Stack>
  );
}

function AnimatedRing({ value, color, isOpened }) {
  const display = useAnimatedValue(value, isOpened, true);

  return (
    <RingProgress
      roundCaps
      rootColor="var(--color-ac)"
      sections={[{ value: display, color }]}
      label={
        <Text size="xl" fw={800} ta="center" c={color}>
          {display}%
        </Text>
      }
    />
  );
}

function useAnimatedValue(
  targetValue,
  resetTrigger,
  willBounce = false,
  duration = 1200,
) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const numericTarget = Number(targetValue);
    if (isNaN(numericTarget)) {
      setDisplay(targetValue);
      return;
    }

    setDisplay(0);

    let start = performance.now();
    let frameId;

    const animate = (t) => {
      const p = Math.min((t - start) / duration, 1);

      const eased = willBounce
        ? Math.pow(p - 1, 3) + 1 + 0.1 * Math.sin(p * Math.PI)
        : 1 - Math.pow(1 - p, 3);

      setDisplay(Math.round(eased * numericTarget));

      if (p < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [targetValue, resetTrigger, willBounce, duration]);

  return display;
}
