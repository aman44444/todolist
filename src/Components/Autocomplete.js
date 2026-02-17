import { useState, useRef, useEffect } from "react";
import { TaskSuggestions } from "../data/data";
import "../Styles/Input.css";

const Autocomplete = () => {
  const [task, setTask] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);


  const filteredTasks = task.length
    ? TaskSuggestions.filter((item) =>
        item.toLowerCase().includes(task.toLowerCase())
      )
    : TaskSuggestions;

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Added Task:", task);
    setTask("");
    setIsFocused(false);
  };

  const handleSelect = (value) => {
    setTask(value);
    setIsFocused(false);
  };

  return (
    <div ref={containerRef}>
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="task-input"
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Add a task..."
        />
        <button className="add-button" type="submit">
          Add
        </button>
      </form>

      {isFocused && filteredTasks.length > 0 && (
        <ul className="suggestions-list">
          {filteredTasks.map((item) => (
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
