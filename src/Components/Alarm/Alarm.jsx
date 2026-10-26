import { useState, useRef, useEffect, useId, useLayoutEffect, useCallback } from "react";
import "../../styles/Alarm/Alarm.css";
import { PiAlarmLight } from "react-icons/pi";
import AlarmPicker, { defaultTime, isValidTime } from "../AlarmTimePicker/AlarmTimePicker";

export default function Alarm({ alarmTime, setAlarmTime }) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("00:00");
  const containerRef = useRef(null);
  const popupRef = useRef(null);
  const triggerRef = useRef(null);
  const id = useId();
  const close = useCallback((restoreFocus = false) => {
    setIsOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);
  useEffect(() => {
    if (!isOpen) return;
    const outside = (event) => {
      if (!containerRef.current?.contains(event.target)) close();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
    };
  }, [isOpen, close]);
  useLayoutEffect(() => {
    if (!isOpen) return;
    const position = () => {
      const popup = popupRef.current;
      const viewport = window.visualViewport;
      const width = viewport?.width || window.innerWidth;
      const height = viewport?.height || window.innerHeight;
      const originX = viewport?.offsetLeft || 0;
      const originY = viewport?.offsetTop || 0;
      popup.style.maxHeight = Math.max(0, height - 24) + "px";
      popup.style.maxWidth = Math.max(0, width - 24) + "px";
      const addButton = triggerRef.current.closest("form")?.querySelector('button[type="submit"]');
      const anchor = (addButton || triggerRef.current).getBoundingClientRect();
      const rect = popup.getBoundingClientRect();
      const left = Math.max(originX + 12, Math.min(anchor.right - rect.width, originX + width - rect.width - 12));
      const below = anchor.bottom + 10;
      const above = anchor.top - rect.height - 10;
      const top = below + rect.height <= originY + height - 12 ? below
        : above >= originY + 12 ? above : Math.max(originY + 12, originY + height - rect.height - 12);
      popup.style.left = left + "px";
      popup.style.top = top + "px";
    };
    position();
    popupRef.current.querySelector('[role="spinbutton"]')?.focus({ preventScroll: true });
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    window.visualViewport?.addEventListener("resize", position);
    window.visualViewport?.addEventListener("scroll", position);
    return () => {
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
      window.visualViewport?.removeEventListener("resize", position);
      window.visualViewport?.removeEventListener("scroll", position);
    };
  }, [isOpen]);
  return <div className="alarm-wrapper" ref={containerRef} onKeyDown={(event) => {
    if (isOpen && event.key === "Escape") { event.preventDefault(); event.stopPropagation(); close(true); }
  }}>
    <button ref={triggerRef} className={"alarm-icon" + (isValidTime(alarmTime) ? " has-alarm" : "")} type="button"
      aria-label={isValidTime(alarmTime) ? "Change alarm, " + alarmTime : "Set alarm"}
      aria-expanded={isOpen} aria-haspopup="dialog" aria-controls={isOpen ? id : undefined}
      onClick={() => {
        if (isOpen) close();
        else { setDraft(isValidTime(alarmTime) ? alarmTime : defaultTime()); setIsOpen(true); }
      }}>
      <PiAlarmLight size={26} />
      {isValidTime(alarmTime) && <span className="alarm-selected-time">{alarmTime}</span>}
    </button>
    {isOpen && <div ref={popupRef} id={id} className="alarm-popup" role="dialog" aria-labelledby={id + "-title"}>
      <div className="alarm-popup-header"><h2 id={id + "-title"}>Alarm time</h2><span>24-hour</span></div>
      <AlarmPicker alarmTime={draft} setAlarmTime={setDraft} />
      <div className="alarm-popup-actions">
        <button type="button" onClick={() => { setAlarmTime(null); close(true); }}>Remove</button>
        <button type="button" onClick={() => { setAlarmTime(draft); close(true); }}>Done</button>
      </div>
    </div>}
  </div>;
}
