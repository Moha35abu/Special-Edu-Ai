import type { Student } from "./types";

export const DIAGNOSIS_OPTIONS = [
  "اضطراب طيف التوحد",
  "صعوبات التعلم",
  "بطء التعلم",
  "تأخر نمائي",
  "فرط الحركة وتشتت الانتباه (ADHD)",
  "متلازمة داون",
  "أخرى",
];

export const ASSESSMENT_AREAS = {
  academicSkills: "المهارات الأكاديمية",
  languageAndCommunication: "اللغة والتواصل",
  sensoryAndCognitiveSkills: "المهارات الحسية والإدراكية",
  socialSkills: "المهارات الاجتماعية",
  behaviorAndSelfRegulation: "السلوك والتنظيم الذاتي",
  motorSkills: "المهارات الحركية",
};

export const GOAL_TYPES = [
  "أكاديمي",
  "لغوي",
  "سلوكي",
  "حركي",
  "اجتماعي",
  "رعاية ذاتية",
];

export const MASTERY_LEVELS = ["مبدئي", "متقدم", "متقن"];
