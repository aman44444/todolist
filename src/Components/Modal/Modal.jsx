import { useEffect, useId, useRef } from "react";
import "../../styles/Modal/Modal.css";

const Modal = ({ isOpen, onClose, title, switchValue, onSwitchChange, children }) => {
  const overlayRef = useRef(null);
  const closeRef = useRef(null);
  const titleId = useId();
  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const siblings = [...overlayRef.current.parentElement.children].filter((node) => node !== overlayRef.current);
    const previousInert = siblings.map((node) => node.inert);
    siblings.forEach((node) => { node.inert = true; });
    document.body.style.overflow = "hidden";
    closeRef.current.focus();
    return () => {
      siblings.forEach((node, index) => { node.inert = previousInert[index]; });
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" ref={overlayRef} onKeyDown={(event) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); }
      if (event.key === "Tab") {
        const controls = [...overlayRef.current.querySelectorAll('button:not([disabled]), input:not([disabled]), [tabindex="0"]')];
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }}>
      <div className="modal-container" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="modal-top-container">
          <button ref={closeRef} type="button" aria-label="Close mode settings" className="modal-close" onClick={onClose}>×</button>
          <div className="modal-header">
            <h2 id={titleId}>{title}</h2>
            <div className="mode-switch">
              <label className="switch">
                <input type="checkbox" role="switch" aria-label="Strict mode" checked={switchValue} onChange={onSwitchChange} />
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
