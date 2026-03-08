import useTodosStore from "../../store/store";
import "../../Styles/TasksContainer/TasksContainer.css"

const TasksContainer = () => {

    const {tasks} = useTodosStore();

    return(
        <div className="task-container">
             <ul className="task-list">    
                 {tasks.map((task) =>(
                    <li key={task.id} className="task-item">
                        <span className="task-text">{task.text}</span>
                        {task.alarmTime && <span>{task.alarmTime}</span>}  
                    </li>     
                ))
             }
             </ul>
        </div>
    )
}

export default TasksContainer;