# Todo App with Alarm & Modes

A modern Todo application built with **React + Zustand**, featuring task management, alarms, and a unique **Normal / Strict Mode** system to improve productivity.

---

## Features

### Task Management
- Add tasks with autocomplete suggestions
- Remove tasks
- Clean and minimal UI

### Alarm 
- Set alarm time for each task
- Alarm triggers at the exact time
- Continuous ringing until stopped
- Stop alarm using:
  - Stop button
  - Removing the task

### Modes
- **Normal Mode**
  - Full flexibility
  - Can stop alarm anytime

- **Strict Mode**
  - Designed for discipline
  - (Extendable) Prevent stopping alarm until task is completed

## Tech Stack
- React.js → UI layer
- Zustand → Global state management
- JavaScript (ES6+)
- SASS → Styling and responsiveness

## Folder Structure

src/
├── components/     → UI components
├── store/          → Zustand store
├── services/       → Alarm Engine (core logic)
├── styles/         → CSS
├── App.jsx         → Root connection layer