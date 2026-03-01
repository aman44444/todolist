export const TaskSuggestions = [
  "Morning workout",
  "Evening walk",
  "Meditate for 10 minutes",
  "Drink 2L water",
  "Call parents",
  "Pay electricity bill",
  "Buy groceries",
  "Clean room",
]

export const Modes = [
  {
    id: "normal",
    label: "Normal Mode",
    rules: [
      "Alarm can be dismissed anytime",
      "Tasks are optional reminders",
      "No penalties for skipping tasks",
      "Flexible schedule",
    ],
  },
  {
    id: "strict",
    label: "Strict Mode",
    rules: [
      "Alarm cannot be auto dismissed",
      "Alarm repeats until manually stopped",
      "Tasks must be completed",
      "No skipping tasks allowed",
      "High discipline mode enabled",
    ],
  },
];