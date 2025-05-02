export class SRTFScheduler {
    constructor(processes) {
        this.processes = processes;
    }
    run() {
        var _a, _b;
        const timeline = [];
        const processes = [...this.processes];
        const remainingTimeMap = new Map();
        processes.forEach((p) => remainingTimeMap.set(p.id, p.burstTime));
        let currentTime = 0;
        let lastProcess = null;
        let startTime = 0;
        const completed = new Set();
        while (completed.size < processes.length) {
            // Get ready processes
            const readyQueue = processes.filter((p) => {
                var _a;
                return p.arrivalTime <= currentTime &&
                    !completed.has(p.id) &&
                    ((_a = remainingTimeMap.get(p.id)) !== null && _a !== void 0 ? _a : 0) > 0;
            });
            if (readyQueue.length === 0) {
                currentTime++;
                continue;
            }
            // Pick the one with shortest remaining time
            readyQueue.sort((a, b) => { var _a, _b; return ((_a = remainingTimeMap.get(a.id)) !== null && _a !== void 0 ? _a : 0) - ((_b = remainingTimeMap.get(b.id)) !== null && _b !== void 0 ? _b : 0); });
            const currentProcess = readyQueue[0];
            // Start new segment if a different process is selected
            if ((lastProcess === null || lastProcess === void 0 ? void 0 : lastProcess.id) !== currentProcess.id) {
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
            remainingTimeMap.set(currentProcess.id, ((_a = remainingTimeMap.get(currentProcess.id)) !== null && _a !== void 0 ? _a : 1) - 1);
            currentTime++;
            // If done, add the final segment and mark completed
            if (((_b = remainingTimeMap.get(currentProcess.id)) !== null && _b !== void 0 ? _b : 0) === 0) {
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
