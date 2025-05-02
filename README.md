# OS Process Scheduling Visualizer

A simple and interactive web-based visualizer for popular CPU scheduling algorithms, built using HTML, CSS, and TypeScript.

Visualize how different scheduling strategies execute processes over time, complete with timeline progress bars and process details.

![Scheduling Visualizer Demo](https://github.com/natitedros/os-scheduling-visualization/blob/main/demo.gif?raw=true)

## ✨ Features

- 🟢 **First Come First Serve (FCFS)**
- 🟡 **Shortest Job First (SJF)**
- 🔁 **Shortest Remaining Time First (SRTF)**
- 🕒 **Round Robin** (with configurable time quantum)
- 🔼 **Priority Scheduling** (both preemptive and non-preemptive modes)
- 📊 **Interactive timeline visualization**
- ⚙️ **Customizable process parameters**
- 🎨 **Color-coded processes for easy tracking**
- ⏱️ **Simulation speed control**

---

## 📸 Live Demo

Check out the live demo here:  
👉 [OS Scheduling Visualizer Demo](https://natitedros.github.io/os-scheduling-visualization/)

---

## 🚀 Getting Started

To run the project locally:

1. Clone the repository

   ```bash
   git clone https://github.com/natitedros/os-scheduling-visualization.git
   ```

2. Navigate to the project directory

   ```bash
   cd os-scheduling-visualization
   ```

3. Open `index.html` in your preferred browser

---

## 🛠️ How to Use

### Add Processes

- Click **"Add Process"** to create new processes
- Set **arrival time**, **burst time**, and **priority** for each process
- Drag to reorder processes in FCFS mode

### Configure Simulation

- Select a scheduling algorithm from the dropdown
- For **Round Robin**, set the **time quantum**
- For **Priority Scheduling**, choose **preemptive** or **non-preemptive**
- Adjust simulation speed as needed

### Run Visualization

- Click **"Start"** to begin the simulation
- **Pause/resume** with the control buttons
- **Reset** at any time to start over

---

## 📚 Supported Algorithms

| Algorithm   | Description                   | Preemptive?  |
| ----------- | ----------------------------- | ------------ |
| FCFS        | First Come First Serve        | No           |
| SJF         | Shortest Job First            | No           |
| SRTF        | Shortest Remaining Time First | Yes          |
| Round Robin | Uses time slicing             | Yes          |
| Priority    | Priority-based scheduling     | Configurable |

---

## 🧑‍💻 Development

This project is built with:

- TypeScript
- HTML5
- CSS3
