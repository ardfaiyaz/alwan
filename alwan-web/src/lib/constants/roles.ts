/**
 * User Roles and Permissions
 * @module lib/constants
 */

export const ROLES = {
  ADMIN: 'admin',
  AREA_MANAGER: 'area_manager',
  BRANCH_MANAGER: 'branch_manager',
  FIELD_OFFICER: 'field_officer',
  MEMBER: 'member',
} as const

export type UserRole = typeof ROLES[keyof typeof ROLES]

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [ROLES.ADMIN]: 4,
  [ROLES.AREA_MANAGER]: 3,
  [ROLES.BRANCH_MANAGER]: 2,
  [ROLES.FIELD_OFFICER]: 1,
  [ROLES.MEMBER]: 0,
}

export const ROLE_LABELS: Record<UserRole, string> = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.AREA_MANAGER]: 'Area Manager',
  [ROLES.BRANCH_MANAGER]: 'Branch Manager',
  [ROLES.FIELD_OFFICER]: 'Field Officer',
  [ROLES.MEMBER]: 'Member',
}

export const ADMIN_ROLES: UserRole[] = [
  ROLES.ADMIN,
  ROLES.AREA_MANAGER,
  ROLES.BRANCH_MANAGER,
  ROLES.FIELD_OFFICER,
]

export const STAFF_ROLES: UserRole[] = [
  ROLES.ADMIN,
  ROLES.AREA_MANAGER,
  ROLES.BRANCH_MANAGER,
  ROLES.FIELD_OFFICER,
]
