import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useTodosStore = create(
  persist(
    (set) => {
      return {
        tasks: [],
        mode: "normal",
        activeAlarmTaskId: null,

        setMode: (newMode) => set({ mode: newMode }),

        triggerAlarm: (taskId) =>
          set({
            activeAlarmTaskId: taskId,
          }),

        stopAlarm: () =>
          set({
            activeAlarmTaskId: null,
          }),
        addTasks: (task) => {
          set((state) => ({
            tasks: [
              ...state.tasks,
              {
                id: Date.now().toString(),
                text: task.text,
                alarmTime: task.alarmTime || null,
                completed: false,
              },
            ],
          }));
        },
        removeTask: (id) =>
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
            activeAlarmTaskId: null, 
          })),
      
      };
    },
    {
      name: "Todo-list",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useTodosStore;
