import useTodosStore from "../../store/store";

const TasksContainer = () => {

    const {tasks, removeTask} = useTodosStore();

    return(
        <div className="task-container">
             <ul>    
                 {tasks.map((task)=>(
                  <>
                    <li key={task.id}>
                        {task.task}
                    </li>   
                    <button onClick={()=> removeTask(task.id)}>
                        remove
                    </button>   
                  </>   
                ))
             }
             </ul>
        </div>
    )
}

export default TasksContainer;