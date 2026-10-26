import React, { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Modal from "./Modal";
function Harness() {
  const [open, setOpen] = useState(false);
  const [strict, setStrict] = useState(false);
  return <><button onClick={() => setOpen(true)}>Mode</button><Modal isOpen={open} onClose={() => setOpen(false)} title="Mode" switchValue={strict} onSwitchChange={() => setStrict(!strict)}><p>{strict ? "Strict rules" : "Normal rules"}</p></Modal></>;
}
test("mode dialog labels, keyboard containment, Escape and focus restoration", () => {
  render(<Harness />);
  const trigger = screen.getByRole("button", { name: "Mode" });
  trigger.focus(); fireEvent.click(trigger);
  const close = screen.getByRole("button", { name: "Close mode settings" });
  expect(screen.getByRole("dialog", { name: "Mode" })).toHaveAttribute("aria-modal", "true");
  expect(close).toHaveFocus();
  fireEvent.keyDown(close, { key: "Tab", shiftKey: true });
  const toggle = screen.getByRole("switch", { name: "Strict mode" });
  expect(toggle).toHaveFocus();
  fireEvent.click(toggle); expect(toggle).toBeChecked();
  expect(screen.getByText("Strict rules")).toBeInTheDocument();
  fireEvent.keyDown(toggle, { key: "Tab" }); expect(close).toHaveFocus();
  fireEvent.keyDown(close, { key: "Escape" });
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
  expect(document.body.style.overflow).not.toBe("hidden");
});
