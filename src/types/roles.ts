export enum Role {
  DeliveryManager = 'DM', BusinessAnalyst = 'BA', HumanResource = 'HR',
  ProductOwner = 'PO', Developer = 'D', ScrumMaster = 'SM',
}
export const ROLE_LABELS: Record<Role, string> = {
  [Role.DeliveryManager]: 'Delivery Manager (DM)',
  [Role.BusinessAnalyst]: 'Business Analyst (BA)',
  [Role.HumanResource]: 'Human Resource (HR)',
  [Role.ProductOwner]: 'Product Owner (PO)',
  [Role.Developer]: 'Developer (D)',
  [Role.ScrumMaster]: 'Scrum Master (SM)',
};

export interface Permissions { access: boolean; add: boolean; edit: boolean; delete: boolean; }
export type PermissionKey = keyof Permissions;
export type RolePermissions = Record<Role, Permissions>;
export interface RoleAssignment { username: string; role: Role; }
export interface RolesPayload { assignments: RoleAssignment[]; permissions: RolePermissions; }
export interface Me { username: string; role: Role; permissions: Permissions; }

export const PERMISSION_ROWS: { key: PermissionKey; label: string }[] = [
  { key: 'access', label: 'Access to Task Management' },
  { key: 'add', label: 'Add task' },
  { key: 'edit', label: 'Edit task' },
  { key: 'delete', label: 'Delete task' },
];