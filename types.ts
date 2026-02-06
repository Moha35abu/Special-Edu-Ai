
export interface PersonalInfo {
  fullName: string;
  studentId: string;
  dob: string;
  grade: string;
  photoUrl?: string;
  parentContact: string;
  enrollmentDate: string;
}

export interface MedicalDiagnosis {
  primaryDiagnosis: string;
  secondaryDiagnoses: string;
  reportFile: File | null;
  reportFileSummary?: string;
  diagnosisDate: string;
  diagnosingEntity: string;
}

export interface CaseStudy {
  medicalHistory: string;
  developmentalHistory: string;
  familySituation: string;
  strengths: string;
  challenges: string;
  prominentBehaviors: string;
  interestsAndMotivators: string;
}

export interface AssessmentArea {
  level: number; // e.g., 1-5 scale
  notes: string;
}

export interface Assessments {
  academicSkills: AssessmentArea;
  languageAndCommunication: AssessmentArea;
  sensoryAndCognitiveSkills: AssessmentArea;
  socialSkills: AssessmentArea;
  behaviorAndSelfRegulation: AssessmentArea;
  motorSkills: AssessmentArea;
}

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

export interface GeneratedPlan {
    content: string;
    createdAt: string;
}

export interface SessionLog {
    id: string;
    date: string;
    time: string;
    duration: number; // in minutes
    notes: string;
}

export interface UpcomingSession {
    id: string;
    date: string;
    time: string;
    duration: number; // in minutes
}

export interface AchievedGoal {
    id: string;
    description: string;
    achievedAt: string; // ISO string
    goalType: string;
    masteryLevel: string;
}

export interface Student {
  id: string;
  personalInfo: PersonalInfo;
  medicalDiagnosis: MedicalDiagnosis;
  caseStudy: CaseStudy;
  assessments: Assessments;
  planHistory: GeneratedPlan[];
  chatHistory: ChatMessage[];
  sessionLogs: SessionLog[];
  upcomingSessions: UpcomingSession[];
  achievedGoals: AchievedGoal[];
}