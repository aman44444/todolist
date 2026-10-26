import { useCallback, useEffect, useLayoutEffect, useRef, useState, useId } from "react";
import "../../styles/AlarmTimePicker/AlarmTimePicker.css";

export const isValidTime = (time) => typeof time === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
const pad = (value) => String(value).padStart(2, "0");
export const defaultTime = () => {
  const now = new Date();
  return pad(now.getHours()) + ":" + pad(now.getMinutes());
};
const clamp = (value, max) => Math.max(0, Math.min(max, value));

// Positions and velocity use rows so text zoom preserves the same physics.
function TimeWheel({ label, value, max, onChange, helpId }) {
  const element = useRef(null);
  const [position, setPosition] = useState(value);
  const motion = useRef({ position: value, target: value, velocity: 0, frame: null, timer: null, drag: null, selected: value });
  const change = useRef(onChange);
  change.current = onChange;
  const reduced = useRef(false);
  const stop = useCallback(() => {
    cancelAnimationFrame(motion.current.frame);
    clearTimeout(motion.current.timer);
    motion.current.frame = null;
    motion.current.timer = null;
  }, []);
  const present = useCallback((next) => {
    const state = motion.current;
    state.position = next;
    setPosition(next);
    const selected = clamp(Math.round(next), max);
    if (selected !== state.selected) {
      state.selected = selected;
      change.current(selected);
    }
  }, [max]);
  const settle = useCallback((target, velocity = motion.current.velocity) => {
    stop();
    const state = motion.current;
    state.target = clamp(Math.round(target), max);
    state.velocity = velocity;
    if (reduced.current) {
      present(state.target);
      state.velocity = 0;
      return;
    }
    let previous = performance.now();
    const tick = (now) => {
      const dt = Math.min((now - previous) / 1000, 0.032);
      previous = now;
      state.velocity += ((state.target - state.position) * 300 - state.velocity * 35) * dt;
      const next = state.position + state.velocity * dt;
      if (Math.abs(next - state.target) < 0.002 && Math.abs(state.velocity) < 0.02) {
        present(state.target);
        state.velocity = 0;
        state.frame = null;
      } else {
        present(next);
        state.frame = requestAnimationFrame(tick);
      }
    };
    state.frame = requestAnimationFrame(tick);
  }, [max, present, stop]);
  useLayoutEffect(() => {
    const state = motion.current;
    // Parent echoes must not interrupt a gesture; external changes must.
    if (value !== state.selected) {
      stop();
      state.drag = null;
      state.velocity = 0;
      state.selected = value;
      state.target = value;
      state.position = value;
      setPosition(value);
    }
  }, [value, stop]);
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const update = () => {
      reduced.current = Boolean(media?.matches);
      if (reduced.current && motion.current.frame) settle(motion.current.target, 0);
    };
    update();
    media?.addEventListener?.("change", update);
    return () => { stop(); media?.removeEventListener?.("change", update); };
  }, [settle, stop]);
  const rowHeight = () => element.current.getBoundingClientRect().height / 5 || 44;
  useEffect(() => {
    const node = element.current;
    const wheel = (event) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      event.preventDefault();
      if (motion.current.drag) return;
      stop();
      const height = node.getBoundingClientRect().height / 5 || 44;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? height * 5 : 1);
      motion.current.velocity = 0;
      present(clamp(motion.current.position + delta / height, max));
      motion.current.timer = setTimeout(() => settle(motion.current.position, 0), 100);
    };
    node.addEventListener("wheel", wheel, { passive: false });
    return () => node.removeEventListener("wheel", wheel);
  }, [max, present, settle, stop]);
  const pointerDown = (event) => {
    if (event.button !== 0 || motion.current.drag) return;
    stop();
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    motion.current.drag = { id: event.pointerId, y: event.clientY, start: motion.current.position, moved: false, samples: [{ y: event.clientY, time: performance.now() }] };
  };
  const pointerMove = (event) => {
    const drag = motion.current.drag;
    if (!drag || drag.id !== event.pointerId) return;
    if (Math.abs(event.clientY - drag.y) > 4) drag.moved = true;
    if (!drag.moved) return;
    const next = drag.start + (drag.y - event.clientY) / rowHeight();
    const bound = clamp(next, max);
    const over = next - bound;
    present(bound + over * 0.35 / (1 + Math.abs(over)));
    const now = performance.now();
    drag.samples = drag.samples.filter((sample) => now - sample.time < 100);
    drag.samples.push({ y: event.clientY, time: now });
  };
  const pointerEnd = (event, cancelled = false) => {
    const state = motion.current;
    const drag = state.drag;
    if (!drag || drag.id !== event.pointerId) return;
    state.drag = null;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!drag.moved && !cancelled) {
      const rect = element.current.getBoundingClientRect();
      settle(state.position + (event.clientY - rect.top - rect.height / 2) / rowHeight(), 0);
      return;
    }
    const first = drag.samples[0];
    const last = drag.samples[drag.samples.length - 1];
    const elapsed = last.time - first.time;
    const velocity = !cancelled && elapsed > 0 && performance.now() - last.time < 100
      ? Math.max(-35, Math.min(35, (first.y - last.y) / rowHeight() / (elapsed / 1000))) : 0;
    // Exponential deceleration projection followed by a damped snap.
    settle(state.position + velocity * 0.18, velocity);
  };
  const keyDown = (event) => {
    const state = motion.current;
    const current = state.frame ? state.target : Math.round(state.position);
    const targets = { ArrowUp: current - 1, ArrowDown: current + 1, PageUp: current - 5, PageDown: current + 5, Home: 0, End: max };
    if (Object.prototype.hasOwnProperty.call(targets, event.key)) {
      event.preventDefault();
      state.drag = null;
      settle(targets[event.key]);
    }
    // This control lives in the task form; Enter must not add a task.
    if (event.key === "Enter" || event.key === " ") event.preventDefault();
  };
  return <div className="picker-column" ref={element} tabIndex={0} role="spinbutton"
    aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={clamp(Math.round(position), max)}
    aria-valuetext={pad(clamp(Math.round(position), max))} aria-describedby={helpId}
    onKeyDown={keyDown} onPointerDown={pointerDown} onPointerMove={pointerMove}
    onPointerUp={(event) => pointerEnd(event)} onPointerCancel={(event) => pointerEnd(event, true)}
    onLostPointerCapture={(event) => pointerEnd(event, true)}>
    {Array.from({ length: max + 1 }, (_, number) => {
      const distance = number - position;
      if (Math.abs(distance) > 3) return null;
      return <div className={"picker-item" + (number === clamp(Math.round(position), max) ? " active" : "")}
        key={number} aria-hidden="true" style={{
          transform: "translateY(calc(" + distance + " * var(--picker-row) - 50%)) scale(" + (1 - Math.min(Math.abs(distance), 3) * 0.045) + "," + Math.cos(Math.min(Math.abs(distance), 3) * 0.24) + ")",
        }}>{pad(number)}</div>;
    })}
  </div>;
}
export default function AlarmPicker({ alarmTime, setAlarmTime }) {
  const helpId = useId();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const refresh = () => setNow(new Date());
    const timer = setInterval(refresh, 1000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  const localClock = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZoneName: "short",
  }).format(now);
  const time = isValidTime(alarmTime) ? alarmTime : "00:00";
  const [hour, minute] = time.split(":").map(Number);
  const update = (part, value) => setAlarmTime((previous) => {
    const parts = (isValidTime(previous) ? previous : time).split(":");
    parts[part] = pad(value);
    return parts.join(":");
  });
  return <div className="time-picker">
    <div className="picker-labels" aria-hidden="true"><span>Hour</span><span>Minute</span></div>
    <div className="picker-container">
      <TimeWheel label="Hour" helpId={helpId} value={hour} max={23} onChange={(value) => update(0, value)} />
      <span className="picker-separator" aria-hidden="true">:</span>
      <TimeWheel label="Minute" helpId={helpId} value={minute} max={59} onChange={(value) => update(1, value)} />
    </div>
    <p className="picker-summary">Now · {localClock}</p>
    <span id={helpId} className="picker-sr-only">Drag or scroll to select. Use arrow keys, Home, End, or Page Up and Page Down.</span>
  </div>;
}
