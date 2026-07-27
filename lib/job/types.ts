export const jobPositions = ["Nail Artist", "Nail Apprentice"] as const;
export const workingArrangements = ["Full-time", "Part-time"] as const;
export const transportationOptions = [
  "Own transport",
  "Reliable transport arranged",
  "No transport",
] as const;
export const skillLevels = ["No Experience", "Basic", "Skilled"] as const;
export const employmentStatuses = [
  "Not currently employed",
  "Currently employed",
  "Student",
  "Other",
] as const;
export const nailSkillNames = [
  "manicure",
  "pedicure",
  "gelColor",
  "nailArt",
  "nailExtension",
  "nailRemoval",
] as const;

export type JobPosition = (typeof jobPositions)[number];
export type WorkingArrangement = (typeof workingArrangements)[number];
export type Transportation = (typeof transportationOptions)[number];
export type SkillLevel = (typeof skillLevels)[number];
export type EmploymentStatus = (typeof employmentStatuses)[number];
export type NailSkillName = (typeof nailSkillNames)[number];

export type JobApplicationInput = {
  fullName: string;
  whatsappNumber: string;
  currentArea: string;
  isAdult: boolean;
  availableStartDate: string;
  position: JobPosition;
  workingArrangement: WorkingArrangement;
  transportation: Transportation;
  skillLevel: SkillLevel;
  workExperience: string;
  previousWorkplace: string;
  employmentStatus: EmploymentStatus;
  reasonForApplying: string;
  nailSkills: Record<NailSkillName, SkillLevel>;
  languagesSpoken: string[];
  portfolio: string;
  additionalNotes: string;
  declarationAccepted: boolean;
  privacyAccepted: boolean;
  website: string;
};

export type JobApplicationRecord = {
  applicationId: string;
  applicationReference: string;
  applicantName: string;
  phoneNumber: string;
  position: JobPosition;
  currentArea: string;
  startDate: string;
  submissionStatus: "pending" | "processing" | "failed" | "submitted";
  emailStatus: "pending" | "failed" | "accepted";
  emailProviderMessageId: string | null;
  pdfStorageReference: null;
  submittedAt: string;
  updatedAt: string;
};

export type JobApplicationSuccess = {
  success: true;
  applicationReference: string;
  emailAccepted: true;
};

export type JobApplicationFailure = {
  success: false;
  errorCode:
    | "INVALID_REQUEST"
    | "RATE_LIMITED"
    | "PDF_GENERATION_FAILED"
    | "EMAIL_SEND_FAILED"
    | "SUBMISSION_IN_PROGRESS"
    | "SERVICE_UNAVAILABLE";
  message: string;
  applicationReference?: string;
  retryable: boolean;
};
