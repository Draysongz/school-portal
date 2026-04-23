import { Role } from '@prisma/client';

export type Permission =
  | 'manage:all'
  | 'manage:school'
  | 'manage:users'
  | 'view:dashboard'
  | 'mark:attendance'
  | 'create:exam'
  | 'take:exam'
  | 'view:grades';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: ['manage:all'],
  ADMIN: ['manage:school', 'manage:users', 'view:dashboard'],
  TEACHER: ['view:dashboard', 'mark:attendance', 'create:exam'],
  STUDENT: ['view:dashboard', 'take:exam', 'view:grades'],
  PARENT: ['view:dashboard', 'view:grades'],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (permissions.includes('manage:all')) return true;
  return permissions.includes(permission);
}
