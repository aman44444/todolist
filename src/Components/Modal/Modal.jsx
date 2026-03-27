import "../../styles/Modal/Modal.css";

const Modal = ({
  isOpen,
  onClose,
  title,
  switchValue,
  onSwitchChange,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-top-container">
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
          <div className="modal-header">
            <h2>{title}</h2>
            <div className="mode-switch">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={switchValue}
                  onChange={onSwitchChange}
                />
                <span className="slider"></span>
              </label>
              <span>Strict</span>
            </div>
          </div>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
