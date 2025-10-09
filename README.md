# ⛵ Wind Simulation Map

This project is an interactive **boat route simulation tool** that allows users to create, visualize, and simulate sailing routes on a live map.  
It integrates real-time **wind data**, dynamic **boat direction** updates, and an animated **map-based simulation**.

---
<img width="1680" height="1010" alt="form" src="https://github.com/user-attachments/assets/3f0b0c0f-ee19-4717-bbb0-2991df5650f7" />
<img width="1680" height="1010" alt="select-point" src="https://github.com/user-attachments/assets/5a558a9d-212c-44e7-9f59-26110cde24bf" />
<img width="1680" height="1010" alt="simulation" src="https://github.com/user-attachments/assets/4b3b7d76-63a7-4d2c-be16-c55a7954653b" />

---
## 🧩 Tech Stack

- **React 19 (TypeScript)**
- **React Leaflet** (Map Visualization)
- **Context API** (State Management)
- **CSS Modules**
- **Vite** (Bundler)
- **Custom Weather API Integration**

---

## ✨ Features

### 🧭 Route Creation

Users can create a route by adding **waypoints** dynamically.  
Each point can be adjusted by dragging markers on the map.

### 🗺️ Interactive Map

Built on **React Leaflet**, providing zoom, drag, and real-time visual feedback.

### 🌬️ Live Wind Data

Integrates with a live weather API to fetch **wind direction** and **wind speed** for each coordinate in the simulation.

#### 🛰️ Example API Response

```json
{
  "meta": {
    "latitude": "0",
    "longitude": "0"
  },
  "data": {
    "windDirection": 194,
    "windSpeed": 6
  }
}
```

### ⛵ Dynamic Boat Simulation

Simulates boat movement along the defined route.  
Boat direction and speed dynamically adjust based on **wind angle** and **resistance factor**.

### 🧮 Realistic Speed Calculation

Includes a physical simulation formula:

Speed is recalculated at each step of the route.

### ⚡ Real-Time Data Panel

An **InfoBox** displays live data such as:

- Wind Direction & Speed
- Boat Direction & Speed

Values update every few seconds during simulation.

### 📍 Route Editing Modal

A clean modal interface allows users to edit routes visually by dragging points on the map.

---

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/firatorhan/route-simulator.git

# Enter project directory
cd route-simulator

# Install dependencies
npm install

# Run the development server
npm run dev
```
