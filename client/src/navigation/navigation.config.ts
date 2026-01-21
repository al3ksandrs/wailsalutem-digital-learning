import type { NavItem, UserRole } from "./navigation";

export const NAVIGATION_BY_ROLE: Record<UserRole, NavItem[]> = {
  student: [
    { label: "Mijn Matches", path: "/student" },
    { label: "Mijn Verzoeken", path: "/mijnverzoeken" },
    { label: "Mijn Connecties", path: "/mijnconnecties" },
  ],
  teacher: [
    { label: "Mijn Matches", path: "/docent" },
    { label: " Mijn Verzoeken", path: "/studentverzoeken" },
    { label: "Mijn Connecties", path: "/mijnstudenten" },
  ],
  admin: [
    { label: "Dashboard", path: "/admin" },
  ],
};
