import { useEffect } from "react";
import "../../Styles/Modal.css";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  showSwitch = false,
  switchValue = false,
  onSwitchChange,
}) => {
  
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-content">
          {children}
        </div>

        {showSwitch && (
          <div className="modal-footer">
            <label className="switch">
              <input
                type="checkbox"
                checked={switchValue}
                onChange={onSwitchChange}
              />
              <span className="slider" />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;