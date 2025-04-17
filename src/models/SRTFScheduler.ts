import { Process } from "./Process";

export class SRTFScheduler {
  constructor(private processes: Process[]) {}

  run(): { process: Process; start: number; end: number }[] {
    const timeline: { process: Process; start: number; end: number }[] = [];
    const processes = [...this.processes];
    const remainingTimeMap = new Map<number, number>();

    processes.forEach((p) => remainingTimeMap.set(p.id, p.burstTime));

    let currentTime = 0;
    let lastProcess: Process | null = null;
    let startTime = 0;
    const completed: Set<number> = new Set();

    while (completed.size < processes.length) {
      // Get ready processes
      const readyQueue = processes.filter(
        (p) =>
          p.arrivalTime <= currentTime &&
          !completed.has(p.id) &&
          (remainingTimeMap.get(p.id) ?? 0) > 0
      );

      if (readyQueue.length === 0) {
        currentTime++;
        continue;
      }

      // Pick the one with shortest remaining time
      readyQueue.sort(
        (a, b) =>
          (remainingTimeMap.get(a.id) ?? 0) - (remainingTimeMap.get(b.id) ?? 0)
      );
      const currentProcess = readyQueue[0];

      // Start new segment if a different process is selected
      if (lastProcess?.id !== currentProcess.id) {
        if (lastProcess) {
          timeline.push({
            process: lastProcess,
            start: startTime,
            end: currentTime,
          });
        }
        startTime = currentTime;
        lastProcess = currentProcess;
      }

      // Run the process for one time unit
      remainingTimeMap.set(
        currentProcess.id,
        (remainingTimeMap.get(currentProcess.id) ?? 1) - 1
      );
      currentTime++;

      // If done, add the final segment and mark completed
      if ((remainingTimeMap.get(currentProcess.id) ?? 0) === 0) {
        timeline.push({
          process: currentProcess,
          start: startTime,
          end: currentTime,
        });
        completed.add(currentProcess.id);
        lastProcess = null;
      }
    }

    return timeline;
  }
}
