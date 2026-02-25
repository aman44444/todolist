import useTodosStore from "../../store/store";

const TasksContainer = () => {

    const {tasks} = useTodosStore();

    return(
        <div className="task-container">
             <ul>    
                 {tasks.map((task)=>(
                   <li key={task.id}>
                        {task.task}
                   </li>        
                ))
             }
             </ul>
        </div>
    )
}

export default TasksContainer;