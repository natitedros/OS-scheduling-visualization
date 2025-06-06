export class SJFScheduler {
    constructor(processes) {
        this.processes = processes;
    }
    run() {
        const timeline = [];
        let currentTime = 0;
        const processes = [...this.processes]; // avoid mutating the original
        const readyQueue = [];
        const completed = new Set();
        while (completed.size < processes.length) {
            // Add all processes that have arrived by currentTime
            for (const proc of processes) {
                if (proc.arrivalTime <= currentTime &&
                    readyQueue.indexOf(proc) === -1 &&
                    !completed.has(String(proc.id))) {
                    readyQueue.push(proc);
                }
            }
            // If no process is ready, move time forward
            if (readyQueue.length === 0) {
                currentTime++;
                continue;
            }
            // Choose the process with the shortest burst time
            readyQueue.sort((a, b) => a.burstTime - b.burstTime);
            const process = readyQueue.shift();
            const startTime = Math.max(currentTime, process.arrivalTime);
            const endTime = startTime + process.burstTime;
            timeline.push({ process, start: startTime, end: endTime });
            currentTime = endTime;
            completed.add(String(process.id));
        }
        return timeline;
    }
}
