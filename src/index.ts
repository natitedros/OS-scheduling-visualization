import { Process } from "./models/Process.js";
import { FCFSScheduler } from "./models/FCFSScheduler.js";
import { SJFScheduler } from "./models/SJFScheduler.js";
import { SRTFScheduler } from "./models/SRTFScheduler.js";
import { PQScheduler } from "./models/PQScheduler.js";

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

  // Add and hide priority column
  const dropdown = document.getElementById("algorithm") as HTMLSelectElement;
  dropdown.addEventListener("change", () => {
    const cells = document.querySelectorAll<HTMLElement>(".priority");
    if (dropdown.value === "pq") {
      cells.forEach((cell) => {
        cell.style.display = "block";
      });
    } else {
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
  } else {
    scheduler = new PQScheduler(processes);
  }
  const result = scheduler.run();

  const outputDiv = document.getElementById("output")!;
  outputDiv.innerHTML = "<h2>Results:</h2>";

  result.forEach(({ process, start, end }) => {
    const p = document.createElement("p");
    p.textContent = `Process ${process.id} | Start: ${start} | End: ${end}`;
    outputDiv.appendChild(p);
  });
}
