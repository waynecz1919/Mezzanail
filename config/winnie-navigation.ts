import type { Permission } from "@/lib/auth/permissions";

export type WinnieNavigationItem = {
  id: string;
  label: string;
  description: string;
  href: string;
  permission: Permission;
  sensitiveAction?: Permission;
};

export const winnieNavigationItems: readonly WinnieNavigationItem[] = [
  { id: "dashboard", label: "Dashboard", description: "Company overview", href: "/manager", permission: "dashboard.view" },
  { id: "voice-notes", label: "Voice Notes", description: "Personal voice workspace", href: "/manager/voice-notes", permission: "voice_notes.view" },
  { id: "tasks", label: "Tasks", description: "Your assigned work", href: "/manager/tasks", permission: "tasks.view" },
  { id: "customer-tasks", label: "Customer Tasks", description: "Customer follow-up queue", href: "/manager/customer-tasks", permission: "customer_tasks.view" },
  { id: "appointments", label: "Appointments", description: "Appointments access boundary", href: "/manager/appointments", permission: "appointments.view", sensitiveAction: "appointments.delete" },
  { id: "member-credit", label: "Member Credit", description: "Member credit access boundary", href: "/manager/member-credit", permission: "member_credit.view", sensitiveAction: "member_credit.adjust" },
  { id: "whatsapp", label: "WhatsApp Control", description: "Messaging access boundary", href: "/manager/whatsapp", permission: "whatsapp.view", sensitiveAction: "whatsapp.broadcast" },
  { id: "team-hub", label: "Team Hub", description: "Team workspace access boundary", href: "/manager/team-hub", permission: "team_hub.view", sensitiveAction: "team_hub.manage" },
  { id: "inventory", label: "Inventory", description: "Inventory access boundary", href: "/manager/inventory", permission: "inventory.view", sensitiveAction: "inventory.manage" },
  { id: "finance", label: "Finance", description: "Finance access boundary", href: "/manager/finance", permission: "finance.view", sensitiveAction: "finance.manage" },
  { id: "settings", label: "Settings", description: "Company settings access boundary", href: "/manager/settings", permission: "settings.manage", sensitiveAction: "permissions.manage" },
];
