import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useTodosStore = create(persist((set) => {
    return { 
       tasks: [],

       mode: "normal", 

       setMode: (newMode) => set({ mode: newMode }),

       addTasks:(task) => {
           set((state) => ({
                tasks : [
                  ...state.tasks,{
                    id: Date.now().toString(),
                    text: task.text,
                    alarmTime: task.alarmTime || null,
                    completed: false,
                  }
                ]
           }))
       },
       removeTask:(id) =>
           set((state)=>
            ({
                tasks:state.tasks.filter((task) => task.id !== id),
         
       }))
    };
},
   {
     name:"Todo-list",
     storage:createJSONStorage(() => localStorage),
   }
)) 

export default useTodosStore;