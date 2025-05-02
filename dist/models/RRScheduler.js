export class RRScheduler {
    constructor(processes, timeQuantum) {
        this.processes = processes;
        this.timeQuantum = timeQuantum;
    }
    run() {
        const timeline = [];
        let currentTime = 0;
        const processes = [...this.processes]; // Copy of original processes
        // Create a queue and track remaining burst times
        const readyQueue = [];
        const completed = new Set();
        const remainingTimes = new Map();
        // Initialize remaining times
        processes.forEach((proc) => {
            remainingTimes.set(String(proc.id), proc.burstTime);
        });
        while (completed.size < processes.length) {
            // Add arriving processes to the queue
            for (const proc of processes) {
                if (proc.arrivalTime <= currentTime &&
                    !readyQueue.some((item) => item.process.id === proc.id) &&
                    !completed.has(String(proc.id))) {
                    readyQueue.push({
                        process: proc,
                        remainingTime: remainingTimes.get(String(proc.id)),
                    });
                }
            }
            // If no process is ready, move time forward
            if (readyQueue.length === 0) {
                currentTime++;
                continue;
            }
            // Get the next process from the queue
            const currentProcess = readyQueue.shift();
            const processId = String(currentProcess.process.id);
            // Determine execution time (minimum of time quantum or remaining time)
            const executionTime = Math.min(this.timeQuantum, currentProcess.remainingTime);
            const startTime = currentTime;
            const endTime = startTime + executionTime;
            // Record this execution segment
            timeline.push({
                process: currentProcess.process,
                start: startTime,
                end: endTime,
            });
            // Update remaining time
            const newRemainingTime = currentProcess.remainingTime - executionTime;
            remainingTimes.set(processId, newRemainingTime);
            // Update current time
            currentTime = endTime;
            // Check if process completed
            if (newRemainingTime === 0) {
                completed.add(processId);
            }
            else {
                // Re-add to queue if not completed
                readyQueue.push({
                    process: currentProcess.process,
                    remainingTime: newRemainingTime,
                });
            }
        }
        return timeline;
    }
}
