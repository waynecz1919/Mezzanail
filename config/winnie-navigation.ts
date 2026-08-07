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
  { id: "winnie-tools", label: "Winnie AI Tools", description: "Basic operational tools", href: "/manager/winnie-tools", permission: "winnie_ai.basic" },
  { id: "voice-notes", label: "Voice Notes", description: "Personal voice workspace", href: "/manager/voice-notes", permission: "voice_notes.view" },
  { id: "tasks", label: "Tasks", description: "Your assigned work", href: "/manager/tasks", permission: "tasks.view" },
  { id: "customer-tasks", label: "Customer Tasks", description: "Customer follow-up queue", href: "/manager/customer-tasks", permission: "customer_tasks.view" },
  { id: "customer-profile", label: "Customer Profiles", description: "Basic customer profile access", href: "/manager/customer-profile", permission: "customer_profile.view" },
  { id: "appointments", label: "Appointments", description: "Appointments access boundary", href: "/manager/appointments", permission: "appointments.view", sensitiveAction: "appointments.delete" },
  { id: "member-credit", label: "Member Credit", description: "Member credit access boundary", href: "/manager/member-credit", permission: "member_credit.view", sensitiveAction: "member_credit.adjust" },
  { id: "whatsapp", label: "WhatsApp Control", description: "Messaging access boundary", href: "/manager/whatsapp", permission: "whatsapp.view", sensitiveAction: "whatsapp.broadcast" },
  { id: "whatsapp-service", label: "WhatsApp Service", description: "Approved customer-service messaging", href: "/manager/whatsapp-service", permission: "whatsapp.customer_service" },
  { id: "team-hub", label: "Team Hub", description: "Team workspace access boundary", href: "/manager/team-hub", permission: "team_hub.view", sensitiveAction: "team_hub.manage" },
  { id: "reminders", label: "Reminders", description: "Customer reminder operations", href: "/manager/reminders", permission: "reminders.view", sensitiveAction: "reminders.manage" },
  { id: "inventory", label: "Inventory", description: "Inventory access boundary", href: "/manager/inventory", permission: "inventory.view", sensitiveAction: "inventory.manage" },
  { id: "finance", label: "Finance", description: "Finance access boundary", href: "/manager/finance", permission: "finance.view", sensitiveAction: "finance.manage" },
  { id: "settings", label: "Settings", description: "Company settings access boundary", href: "/manager/settings", permission: "settings.manage", sensitiveAction: "permissions.manage" },
];
