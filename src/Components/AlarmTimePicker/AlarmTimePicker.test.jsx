import React, { useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AlarmPicker, { isValidTime } from "./AlarmTimePicker";
import Alarm from "../Alarm/Alarm";

function Harness({ initial = "09:30", popup = false }) {
  const [time, setTime] = useState(initial);
  const Component = popup ? Alarm : AlarmPicker;
  return <><Component alarmTime={time} setAlarmTime={setTime} /><output data-testid="saved">{String(time ?? "none")}</output></>;
}
const wheel = (label) => screen.getByRole("spinbutton", { name: label });
const finish = () => act(() => jest.advanceTimersByTime(2000));
beforeEach(() => {
  jest.useFakeTimers();
  window.matchMedia = jest.fn(() => ({ matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() }));
  window.PointerEvent = MouseEvent;
  HTMLElement.prototype.setPointerCapture = jest.fn();
  HTMLElement.prototype.hasPointerCapture = jest.fn(() => false);
});
afterEach(() => { jest.useRealTimers(); });

test.each(["00:00", "12:00", "23:59"])("keeps exact initial time %s without an off-by-one", (initial) => {
  render(<Harness initial={initial} />);
  const [hour, minute] = initial.split(":");
  expect(wheel("Hour")).toHaveAttribute("aria-valuenow", String(Number(hour)));
  expect(wheel("Minute")).toHaveAttribute("aria-valuenow", String(Number(minute)));
  expect(screen.getByTestId("saved")).toHaveTextContent(initial);
});
test.each([null, "", "24:00", "12:60", "9:30", "NaN:00", {}, "12:00:00"])("handles invalid input %p", (input) => {
  expect(isValidTime(input)).toBe(false);
  render(<Harness initial={input} />);
  expect(wheel("Hour")).toHaveAttribute("aria-valuenow", "0");
  fireEvent.keyDown(wheel("Minute"), { key: "ArrowDown" }); finish();
  expect(screen.getByTestId("saved")).toHaveTextContent("00:01");
});
test("keyboard boundaries, paging, and rapid independent column changes", () => {
  render(<Harness />);
  fireEvent.keyDown(wheel("Hour"), { key: "Home" });
  fireEvent.keyDown(wheel("Minute"), { key: "End" }); finish();
  expect(screen.getByTestId("saved")).toHaveTextContent("00:59");
  fireEvent.keyDown(wheel("Hour"), { key: "ArrowUp" });
  fireEvent.keyDown(wheel("Minute"), { key: "ArrowDown" }); finish();
  expect(screen.getByTestId("saved")).toHaveTextContent("00:59");
  for (let i = 0; i < 3; i++) fireEvent.keyDown(wheel("Hour"), { key: "ArrowDown" });
  fireEvent.keyDown(wheel("Minute"), { key: "PageUp" }); finish();
  expect(screen.getByTestId("saved")).toHaveTextContent("03:54");
});
test("wheel pixel, line, and page deltas select exactly, clamp, and ignore zoom", () => {
  render(<Harness />);
  fireEvent.wheel(wheel("Minute"), { deltaY: 44 }); finish();
  expect(screen.getByTestId("saved")).toHaveTextContent("09:31");
  fireEvent.wheel(wheel("Minute"), { deltaY: 3, deltaMode: 1 }); finish();
  expect(screen.getByTestId("saved")).toHaveTextContent("09:32");
  fireEvent.wheel(wheel("Minute"), { deltaY: 1, deltaMode: 2 }); finish();
  expect(screen.getByTestId("saved")).toHaveTextContent("09:37");
  fireEvent.wheel(wheel("Minute"), { deltaY: -10000 }); finish();
  expect(screen.getByTestId("saved")).toHaveTextContent("09:00");
  fireEvent.wheel(wheel("Minute"), { deltaY: 10000, ctrlKey: true }); finish();
  expect(screen.getByTestId("saved")).toHaveTextContent("09:00");
});
test("external controlled changes replace pending motion", () => {
  const setTime = jest.fn();
  const { rerender } = render(<AlarmPicker alarmTime="09:30" setAlarmTime={setTime} />);
  fireEvent.keyDown(wheel("Hour"), { key: "End" });
  rerender(<AlarmPicker alarmTime="12:45" setAlarmTime={setTime} />); finish();
  expect(wheel("Hour")).toHaveAttribute("aria-valuenow", "12");
  expect(wheel("Minute")).toHaveAttribute("aria-valuenow", "45");
});
test("drag tracks the pointer and canceled gestures settle without a fling", () => {
  render(<Harness />);
  fireEvent.pointerDown(wheel("Minute"), { button: 0, clientY: 100 });
  fireEvent.pointerMove(wheel("Minute"), { clientY: 56 });
  expect(screen.getByTestId("saved")).toHaveTextContent("09:31");
  fireEvent.pointerCancel(wheel("Minute"), { clientY: 56 }); finish();
  expect(screen.getByTestId("saved")).toHaveTextContent("09:31");
});
test("reduced motion applies keyboard selection immediately", () => {
  window.matchMedia.mockReturnValue({ matches: true });
  render(<Harness />);
  fireEvent.keyDown(wheel("Hour"), { key: "End" });
  expect(screen.getByTestId("saved")).toHaveTextContent("23:30");
});
test("unmount cancels timers and animation callbacks", () => {
  const { unmount } = render(<Harness />);
  fireEvent.wheel(wheel("Hour"), { deltaY: 20 });
  unmount();
  expect(jest.getTimerCount()).toBe(0);
});
test("popup only saves on Done, restores focus, reopens saved time, and removes", () => {
  render(<Harness popup initial={null} />);
  fireEvent.click(screen.getByRole("button", { name: "Set alarm" }));
  expect(wheel("Hour")).toHaveFocus();
  fireEvent.keyDown(wheel("Hour"), { key: "Home" });
  fireEvent.keyDown(wheel("Minute"), { key: "Home" }); finish();
  expect(screen.getByTestId("saved")).toHaveTextContent("none");
  fireEvent.click(screen.getByRole("button", { name: "Done" }));
  expect(screen.getByTestId("saved")).toHaveTextContent("00:00");
  expect(screen.getByRole("button", { name: "Change alarm, 00:00" })).toHaveFocus();
  fireEvent.click(screen.getByRole("button", { name: "Change alarm, 00:00" }));
  expect(wheel("Minute")).toHaveAttribute("aria-valuenow", "0");
  fireEvent.keyDown(wheel("Hour"), { key: "End" }); finish();
  fireEvent.keyDown(wheel("Hour"), { key: "Escape" });
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByTestId("saved")).toHaveTextContent("00:00");
  fireEvent.click(screen.getByRole("button", { name: "Change alarm, 00:00" }));
  fireEvent.click(screen.getByRole("button", { name: "Remove" }));
  expect(screen.getByTestId("saved")).toHaveTextContent("none");
});
test("outside pointer and focus dismiss without saving a draft", () => {
  render(<Harness popup />);
  fireEvent.click(screen.getByRole("button", { name: "Change alarm, 09:30" }));
  fireEvent.keyDown(wheel("Hour"), { key: "End" }); finish();
  fireEvent.pointerDown(document.body);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByTestId("saved")).toHaveTextContent("09:30");
  fireEvent.click(screen.getByRole("button", { name: "Change alarm, 09:30" }));
  fireEvent.focusIn(document.body);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("a tap selects its row and a new drag interrupts moving wheels", () => {
  render(<Harness />);
  const minute = wheel("Minute");
  minute.getBoundingClientRect = () => ({ top: 0, height: 220 });
  fireEvent.pointerDown(minute, { button: 0, clientY: 154 });
  fireEvent.pointerUp(minute, { clientY: 154 }); finish();
  expect(screen.getByTestId("saved")).toHaveTextContent("09:31");
  fireEvent.keyDown(minute, { key: "End" });
  act(() => jest.advanceTimersByTime(64));
  const before = Number(minute.getAttribute("aria-valuenow"));
  fireEvent.pointerDown(minute, { button: 0, clientY: 100 });
  fireEvent.pointerMove(minute, { clientY: 144 });
  fireEvent.pointerCancel(minute, { clientY: 144 }); finish();
  expect(Number(minute.getAttribute("aria-valuenow"))).toBe(before - 1);
});
test("Enter on a wheel cannot submit the task form", () => {
  const submit = jest.fn((event) => event.preventDefault());
  render(<form onSubmit={submit}><Harness /><button type="submit">Add</button></form>);
  expect(fireEvent.keyDown(wheel("Hour"), { key: "Enter" })).toBe(false);
  expect(submit).not.toHaveBeenCalled();
});

test("local clock advances independently of the alarm selection", () => {
  jest.setSystemTime(new Date(2026, 9, 26, 13, 29, 59));
  render(<Harness initial="09:30" />);
  const format = () => new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZoneName: "short" }).format(new Date());
  expect(screen.getByText("Now · " + format())).toBeInTheDocument();
  act(() => jest.advanceTimersByTime(1000));
  expect(screen.getByText("Now · " + format())).toBeInTheDocument();
  expect(screen.getByTestId("saved")).toHaveTextContent("09:30");
});
