export type WinnieTeamWorkStatus =
  | "working"
  | "off"
  | "leave"
  | "training"
  | "unknown";

export type WinnieAttendanceStatus =
  | "not_started"
  | "present"
  | "late"
  | "absent"
  | "completed"
  | "unknown";

export type WinnieTeamMember = Readonly<{
  staffId: string;
  name: string;
  role: string;
  workStatus: WinnieTeamWorkStatus;
  attendanceStatus: WinnieAttendanceStatus;
}>;
