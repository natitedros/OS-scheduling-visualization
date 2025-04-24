import { Process } from "./models/Process.js";
import { FCFSScheduler } from "./models/FCFSScheduler.js";
import { SJFScheduler } from "./models/SJFScheduler.js";
import { SRTFScheduler } from "./models/SRTFScheduler.js";
import { PQScheduler } from "./models/PQScheduler.js";
import { RRScheduler } from "./models/RRScheduler.js";

document.addEventListener("DOMContentLoaded", function () {
  const table = document.getElementById("processTable");
  const tbody = table!.querySelector("tbody");
  let rowCount = tbody!.rows.length;

  // Function to make a cell editable on double click
  function makeEditable(cell: any) {
    cell.addEventListener("dblclick", function () {
      const currentValue = cell.textContent;
      const input = document.createElement("input");
      input.type = "text";
      input.value = currentValue;

      cell.textContent = "";
      cell.appendChild(input);
      input.focus();

      // Save when focus is lost
      input.addEventListener("blur", function () {
        cell.textContent = input.value;
      });

      // Save when Enter is pressed
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          cell.textContent = input.value;
        }
      });
    });
  }

  // Make existing cells editable
  document.querySelectorAll(".editable").forEach((cell) => {
    makeEditable(cell);
  });

  // Make Display edits during Round Robin and Priority Queue
  const dropdown = document.getElementById("algorithm") as HTMLSelectElement;
  dropdown.addEventListener("change", () => {
    const cells = document.querySelectorAll<HTMLElement>(".priority");
    const quantumDiv = document.getElementById("timeQdiv");
    if (dropdown.value === "pq") {
      quantumDiv!.style.display = "none";
      cells.forEach((cell) => {
        cell.style.display = "block";
      });
    } else if (dropdown.value === "rr") {
      quantumDiv!.style.display = "block";
      cells.forEach((cell) => {
        cell.style.display = "none";
      });
    } else {
      quantumDiv!.style.display = "none";
      cells.forEach((cell) => {
        cell.style.display = "none";
      });
    }
  });

  // Add new row functionality
  const addRowBtn = document.getElementById("addRowBtn");
  addRowBtn!.addEventListener("click", function () {
    rowCount++;
    const newRow = document.createElement("tr");

    // Create cells
    const idCell = document.createElement("td");
    idCell.textContent = "" + rowCount;

    const arrivalCell = document.createElement("td");
    arrivalCell.textContent = "0";
    arrivalCell.className = "editable";

    const burstCell = document.createElement("td");
    burstCell.textContent = "0";
    burstCell.className = "editable";

    const priorityCell = document.createElement("td");
    priorityCell.textContent = "1";
    priorityCell.className = "editable priority";
    priorityCell.style.display =
      (document.getElementById("algorithm") as HTMLSelectElement).value === "pq"
        ? "block"
        : "none";

    // Add cells to row
    newRow.appendChild(idCell);
    newRow.appendChild(arrivalCell);
    newRow.appendChild(burstCell);
    newRow.appendChild(priorityCell);

    // Add row to table
    tbody!.appendChild(newRow);

    // Make new cells editable
    makeEditable(arrivalCell);
    makeEditable(burstCell);
    makeEditable(priorityCell);
  });

  // Delete last entered process
  const deleteRowBtn = document.getElementById("deleteRowBtn");
  deleteRowBtn!.addEventListener("click", function () {
    if (tbody!.rows.length > 0) {
      tbody!.removeChild(tbody!.lastElementChild!);
      rowCount--;
    } else {
      alert("No rows to be deleted!");
    }
  });

  const calculateBtn = document.getElementById("calculateBtn");
  enum Index {
    ProcessId,
    ArrivalTime,
    BurstTime,
    Priority,
  }

  calculateBtn!.addEventListener("click", function () {
    if (tbody) {
      const rows = Array.from(tbody.rows);
      const rowData: number[][] = rows.map((row) => {
        const cells = Array.from(row.cells);
        return cells.map((cell) => Number(cell.textContent?.trim()));
      });

      const processes: Process[] = rowData.map((row) => {
        return new Process(
          row[Index.ProcessId],
          row[Index.ArrivalTime],
          row[Index.BurstTime],
          row[Index.Priority]
        );
      });

      const dropdown = document.getElementById(
        "algorithm"
      ) as HTMLSelectElement;
      executeOutput(processes, dropdown.value);
    }
  });
});

function executeOutput(processes: Process[], algoType: string) {
  let scheduler;
  if (algoType === "fcfs") {
    scheduler = new FCFSScheduler(processes);
  } else if (algoType === "sjf") {
    scheduler = new SJFScheduler(processes);
  } else if (algoType === "srtf") {
    scheduler = new SRTFScheduler(processes);
  } else if (algoType === "pq") {
    scheduler = new PQScheduler(processes);
  } else {
    scheduler = new RRScheduler(
      processes,
      Number(
        (document.getElementById("timeQuantum")! as HTMLInputElement).value
      )
    );
  }
  const result = scheduler.run();

  const outputDiv = document.getElementById("output")!;
  outputDiv.textContent = "";
  const pListDiv = document.createElement("div");
  pListDiv.innerHTML = "<h4>Logs:</h4>";
  const ganttDiv = document.createElement("div");
  ganttDiv.innerHTML = "<h4>Gantt Chart:</h4>";
  const gantt = document.createElement("div");
  const results = document.getElementById("output-h2");

  results!.style.display = "block";
  outputDiv!.style.display = "flex";
  ganttDiv.className = "gantt-container";
  gantt.id = "gantt-chart";
  pListDiv.className = "output-list";

  let schedule: ScheduledProcess[] = [];

  result.forEach(({ process, start, end }) => {
    const p = document.createElement("p");
    p.textContent = `Process ${process.id} | Start: ${start} | End: ${end}`;
    pListDiv.appendChild(p);

    const tempSched = { processId: process.id, startTime: start, endTime: end };
    schedule.push(tempSched);
  });
  outputDiv.appendChild(pListDiv);
  ganttDiv.appendChild(gantt);
  outputDiv.appendChild(ganttDiv);
  renderVerticalGanttChart(processes, schedule);
}

interface ScheduledProcess {
  processId: number;
  startTime: number;
  endTime: number;
}
function renderVerticalGanttChart(
  processes: Process[],
  schedule: ScheduledProcess[]
) {
  const container = document.getElementById("gantt-chart")!;
  container.innerHTML = "";

  // Get total time range
  const maxEndTime = Math.max(...schedule.map((s) => s.endTime));
  const containerWidth = container.clientWidth; // in pixels

  const timeUnitWidth = containerWidth / maxEndTime;

  // Group schedule entries by process ID
  const scheduleByProcess = new Map<number, ScheduledProcess[]>();
  for (const entry of schedule) {
    if (!scheduleByProcess.has(entry.processId)) {
      scheduleByProcess.set(entry.processId, []);
    }
    scheduleByProcess.get(entry.processId)!.push(entry);
  }

  for (const process of processes) {
    const row = document.createElement("div");
    row.className = "gantt-row";

    const entries = scheduleByProcess.get(process.id) || [];

    for (const entry of entries) {
      const bar = document.createElement("div");
      const duration = entry.endTime - entry.startTime;

      bar.className = `gantt-bar bar-color-${process.id % 5}`;
      bar.style.left = `${entry.startTime * timeUnitWidth}px`;
      bar.style.width = `${duration * timeUnitWidth}px`;
      bar.style.color = "black";
      bar.textContent = `P${entry.processId} [${entry.startTime}-${entry.endTime}]`;

      row.appendChild(bar);
    }

    container.appendChild(row);
  }
}
