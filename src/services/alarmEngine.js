export class AlarmEngine {
  interval = null;

  start(tasks, triggerAlarm) {
    if (this.interval) return;

    this.interval = setInterval(() => {
      const now = new Date();

      const currentTime =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0");

      tasks.forEach((task) => {
        if (
          task.alarmTime &&
          !task.triggered &&
          task.alarmTime.slice(0, 5) === currentTime
        ) {
          triggerAlarm(task.id);
        }
      });
    }, 1000);
  }

  stop() {
    clearInterval(this.interval);
    this.interval = null;
  }
}
