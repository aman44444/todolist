import { create } from "zustand";

const useTodosStore = create((set) => {
    return { 
       tasks: [],
       addTasks:(task) => {
           set((state) => ({
                tasks : [
                  ...state.tasks,{
                    id: Date.now().toString(),
                    task
                  }
                ]
           }))
       }
    };
}) 

export default useTodosStore;