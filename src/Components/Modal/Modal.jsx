import { useEffect } from "react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  showSwitch,
  switchValue,
  onSwitchChange,
}) => {

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal-header">
          <h2 className="modal-title">{title}</h2>

          {showSwitch && (
            <label className="switch">
              <input
                type="checkbox"
                checked={switchValue}
                onChange={onSwitchChange}
              />
              <span className="slider" />
            </label>
          )}

          <button
            type="button"
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <section className="modal-content">
          {children}
        </section>
      </div>
    </div>
  );
};

export default Modal;