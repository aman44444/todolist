export const TaskSuggestions = [
  "Morning workout",
  "Evening walk",
  "Meditate for 10 minutes",
  "Drink 2L water",
  "Call parents",
  "Pay electricity bill",
  "Buy groceries",
  "Clean room",
];

export const Modes = {
  normal: {
    label: "Normal Mode",
    rules: ["Alarm can be auto dismissed"],
  },
  strict: {
    label: "Strict Mode",
    rules: [
      "Alarm cannot be auto dismissed",
      "Alarm loops until manually stopped",
    ],
  },
};
