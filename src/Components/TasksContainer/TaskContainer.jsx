import useTodosStore from "../../store/store";
import "../../styles/TasksContainer/TasksContainer.css";
import Button from "../Button/Button";

const TasksContainer = () => {
  const { tasks, removeTask } = useTodosStore();

  return (
    <div className="task-container">
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <span className="task-text">{task.text}</span>
            <div className="task-footer">
              {task.alarmTime && <span>{task.alarmTime}</span>}
              <Button
                size="sm"
                variant="danger"
                onClick={() => removeTask(task.id)}
              >
                Remove
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksContainer;
