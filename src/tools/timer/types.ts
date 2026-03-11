export type TimerMode = "countdown" | "stopwatch";

export type TimerItem = {
  id: string;
  name: string;
  mode: TimerMode;
  durationSec: number;
  baseElapsedSec: number;
  running: boolean;
  startedAt?: number;
  createdAt: string;
  updatedAt: string;
};
