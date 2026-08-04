import {
  employmentStatuses,
  jobPositions,
  nailSkillNames,
  skillLevels,
  transportationOptions,
  workingArrangements,
  type EmploymentStatus,
  type JobApplicationInput,
  type JobPosition,
  type SkillLevel,
  type Transportation,
  type WorkingArrangement,
} from "@/lib/job/types";

type ValidationResult =
  | { ok: true; value: JobApplicationInput }
  | { ok: false; message: string; fieldErrors: Record<string, string> };

const CONTROL_CHARACTERS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;

function singleLine(value: unknown, maxLength: number) {
  return typeof value === "string"
    ? value.replace(CONTROL_CHARACTERS, "").replace(/\s+/g, " ").trim().slice(0, maxLength)
    : "";
}

function multiLine(value: unknown, maxLength: number) {
  return typeof value === "string"
    ? value
        .replace(CONTROL_CHARACTERS, "")
        .replace(/\r\n?/g, "\n")
        .replace(/[^\S\n]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
        .slice(0, maxLength)
    : "";
}

function enumValue<T extends string>(value: unknown, values: readonly T[]): T | "" {
  const cleaned = singleLine(value, 80);
  return values.includes(cleaned as T) ? (cleaned as T) : "";
}

export function validateJobApplication(payload: unknown): ValidationResult {
  const input = (payload && typeof payload === "object" ? payload : {}) as Record<string, unknown>;
  const rawSkills =
    input.nailSkills && typeof input.nailSkills === "object"
      ? (input.nailSkills as Record<string, unknown>)
      : {};
  const rawLanguages = Array.isArray(input.languagesSpoken) ? input.languagesSpoken : [];
  const fullName = singleLine(input.fullName, 120);
  const whatsappNumber = singleLine(input.whatsappNumber, 32);
  const currentArea = singleLine(input.currentArea, 120);
  const availableStartDate = singleLine(input.availableStartDate, 10);
  const position = enumValue(input.position, jobPositions);
  const workingArrangement = enumValue(input.workingArrangement, workingArrangements);
  const transportation = enumValue(input.transportation, transportationOptions);
  const skillLevel = enumValue(input.skillLevel, skillLevels);
  const employmentStatus = enumValue(input.employmentStatus, employmentStatuses);
  const workExperience = multiLine(input.workExperience, 2_000);
  const previousWorkplace = singleLine(input.previousWorkplace, 160);
  const reasonForApplying = multiLine(input.reasonForApplying, 3_000);
  const portfolio = singleLine(input.portfolio, 300);
  const additionalNotes = multiLine(input.additionalNotes, 2_000);
  const languagesSpoken = [
    ...new Set(
      rawLanguages
        .map((item) => singleLine(item, 40))
        .filter(Boolean)
        .slice(0, 8),
    ),
  ];
  const nailSkills = Object.fromEntries(
    nailSkillNames.map((name) => [name, enumValue(rawSkills[name], skillLevels) || "No Experience"]),
  ) as JobApplicationInput["nailSkills"];

  const fieldErrors: Record<string, string> = {};
  if (!fullName) fieldErrors.fullName = "Enter your full name.";
  if (!/^\+?[\d\s()-]{7,32}$/.test(whatsappNumber)) {
    fieldErrors.whatsappNumber = "Enter a valid WhatsApp number.";
  }
  if (!currentArea) fieldErrors.currentArea = "Enter your current area.";
  if (input.isAdult !== true) fieldErrors.isAdult = "Applicants must be 18 years old or above.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(availableStartDate)) {
    fieldErrors.availableStartDate = "Choose an available start date.";
  } else {
    const date = new Date(`${availableStartDate}T00:00:00+08:00`);
    if (Number.isNaN(date.getTime())) fieldErrors.availableStartDate = "Choose a valid date.";
  }
  if (!position) fieldErrors.position = "Choose a position.";
  if (!workingArrangement) fieldErrors.workingArrangement = "Choose a working arrangement.";
  if (!transportation) fieldErrors.transportation = "Choose a transportation option.";
  if (!skillLevel) fieldErrors.skillLevel = "Choose your skill level.";
  if (!workExperience) fieldErrors.workExperience = "Describe your work experience.";
  if (!employmentStatus) fieldErrors.employmentStatus = "Choose your employment status.";
  if (!reasonForApplying) fieldErrors.reasonForApplying = "Tell us why you are applying.";
  if (languagesSpoken.length === 0) fieldErrors.languagesSpoken = "Choose at least one language.";
  if (input.declarationAccepted !== true) {
    fieldErrors.declarationAccepted = "Confirm that the information is accurate.";
  }
  if (input.privacyAccepted !== true) {
    fieldErrors.privacyAccepted = "Accept the recruitment privacy notice.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      message: "Please review the highlighted application details.",
      fieldErrors,
    };
  }

  return {
    ok: true,
    value: {
      fullName,
      whatsappNumber,
      currentArea,
      isAdult: true,
      availableStartDate,
      position: position as JobPosition,
      workingArrangement: workingArrangement as WorkingArrangement,
      transportation: transportation as Transportation,
      skillLevel: skillLevel as SkillLevel,
      workExperience,
      previousWorkplace,
      employmentStatus: employmentStatus as EmploymentStatus,
      reasonForApplying,
      nailSkills,
      languagesSpoken,
      portfolio,
      additionalNotes,
      declarationAccepted: true,
      privacyAccepted: true,
      website: singleLine(input.website, 200),
    },
  };
}
