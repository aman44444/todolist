import { useAutocomplete } from "./useAutocomplete";
import { TaskSuggestions } from "../../data/data";
import "../../Styles/Autocomplete.css"
import useTodosStore from "../../store/store";

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

  const {addTasks} = useTodosStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    addTasks(task);
    reset();
  };

  return (
    <div ref={containerRef}>
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="task-input"
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Add a task..."
        />
        <button className="add-button" type="submit">
          Add
        </button>
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
