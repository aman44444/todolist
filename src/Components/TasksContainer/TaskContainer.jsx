import useTodosStore from "../../store/store";
import "../../Styles/TasksContainer/TasksContainer.css"

const TasksContainer = () => {

    const {tasks, removeTask} = useTodosStore();

    return(
        <div className="task-container">
             <ul className="task-list">    
                 {tasks.map((task)=>(
                    <li key={task.id} className="task-item">
                        <span className="task-text">{task.task}</span>
                        <button className="remove-button" onClick={()=> removeTask(task.id)}>
                           remove
                        </button>   
                    </li>     
                ))
             }
             </ul>
        </div>
    )
}

export default TasksContainer;