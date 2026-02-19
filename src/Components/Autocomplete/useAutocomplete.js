import { useState, useRef, useEffect, useMemo } from "react";

export const useAutocomplete = (suggestions = []) => {
  const [task, setTask] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const filteredSuggestions = useMemo(() => {
    if (!task.trim()) return suggestions;

    return suggestions.filter((item) =>
      item.toLowerCase().includes(task.toLowerCase())
    );
  }, [task, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    setTask(item);
    setIsOpen(false);
  };

  const reset = () => {
    setTask("");
    setIsOpen(false);
  };

  return {
    task,
    setTask,
    isOpen,
    setIsOpen,
    filteredSuggestions,
    handleSelect,
    reset,
    containerRef,
  };
};
