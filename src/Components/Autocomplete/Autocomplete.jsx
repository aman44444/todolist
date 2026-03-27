import { useState } from "react";
import { useAutocomplete } from "./useAutocomplete";
import { TaskSuggestions } from "../../data/data";
import "../../styles/Autocomplete/Autocomplete.css";
import useTodosStore from "../../store/store";
import Alarm from "../Alarm/Alarm";
import Button from "../Button/Button";

const Autocomplete = () => {
  const {
    task,
    setTask,
    isOpen,
    setIsOpen,
    filteredSuggestions,
    handleSelect,
    reset,
    containerRef,
  } = useAutocomplete(TaskSuggestions);

  const { addTasks } = useTodosStore();

  const [alarmTime, setAlarmTime] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!task.trim()) return;
    addTasks({
      text: task,
      alarmTime,
    });
    reset();
  };

  return (
    <div className="input-wrapper" ref={containerRef}>
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="task-input"
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Add a task..."
        />
        <Alarm alarmTime={alarmTime} setAlarmTime={setAlarmTime} />

        <Button type="submit" variant="success">
          Add
        </Button>
      </form>

      {isOpen && filteredSuggestions.length > 0 && (
        <ul className="suggestions-list">
          {filteredSuggestions.map((item) => (
            <li
              key={item}
              onClick={() => handleSelect(item)}
              className="suggestion-item"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
