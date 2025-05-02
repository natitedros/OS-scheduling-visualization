export class FCFSScheduler {
    constructor(processes) {
        this.processes = processes;
    }
    run() {
        const timeline = [];
        let currentTime = 0;
        const sorted = this.processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
        for (const process of sorted) {
            const startTime = Math.max(currentTime, process.arrivalTime);
            const endTime = startTime + process.burstTime;
            timeline.push({ process, start: startTime, end: endTime });
            currentTime = endTime;
        }
        return timeline;
    }
}
