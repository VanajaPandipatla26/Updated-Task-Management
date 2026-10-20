import { Permissions, Role, RoleAssignment, RolePermissions } from '@/types/roles';

const all: Permissions = { access: true, add: true, edit: true, delete: true };
const noDelete: Permissions = { access: true, add: true, edit: true, delete: false };

const defaults: RolePermissions = {
  [Role.DeliveryManager]: { ...all },
  [Role.ProductOwner]: { ...all },
  [Role.ScrumMaster]: { ...noDelete },
  [Role.BusinessAnalyst]: { ...noDelete },
  [Role.Developer]: { ...noDelete },
  [Role.HumanResource]: { access: false, add: false, edit: false, delete: false },
};

interface Store { assignments: Record<string, RoleAssignment>; permissions: RolePermissions; }

// In-memory (resets when the server restarts). Keyed by lowercase username.
const g = globalThis as unknown as { __roles?: Store };
export const rolesDb: Store = (g.__roles ??= { assignments: {}, permissions: defaults });

export const roleOf = (username: string): Role =>
  rolesDb.assignments[username.toLowerCase()]?.role ?? Role.Developer;