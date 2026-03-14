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

export const Modes = {
  normal: {
    label: "Normal Mode",
    rules: [
      "Alarm can be dismissed anytime",
      "Tasks are flexible",
      "No penalties for skipping tasks",
      "Free schedule management",
    ],
  },
  strict: {
    label: "Strict Mode",
    rules: [
      "Alarm cannot be auto dismissed",
      "Alarm loops until manually stopped",
      "Tasks must be completed",
      "No skipping allowed",
      "High discipline enforced",
    ],
  },
};