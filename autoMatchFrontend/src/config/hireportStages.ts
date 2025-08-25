export const hirePortApplicationStages = {
  JR: "Job Requisition and Approval",
  JP: "Job Posting",
  AC: "Application Collection",
  SN: "Screening",
  IP: "Interview Process",
  FE: "Feedback and Evaluation",
  OM: "Offer Management",
  HO: "Hiring and Onboarding",
} as const;

export const stageColors: Record<string, string> = {
  JR: "#A5D8FF", // light sky blue
  JP: "#C3FBD8", // mint green
  AC: "#FFF3B0", // soft pastel yellow
  SN: "#FFD6A5", // peach
  IP: "#D3C0F9", // lavender
  FE: "#FFADC1", // pastel rose
  OM: "#B5F2EA", // soft aqua
  HO: "#CDEAC0", // pastel lime green
};
