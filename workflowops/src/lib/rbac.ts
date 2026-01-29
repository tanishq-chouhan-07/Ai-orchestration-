export type Role = "viewer" | "operator" | "admin";

const roleRank: Record<Role, number> = {
  viewer: 0,
  operator: 1,
  admin: 2,
};

export function hasRole(userRole: Role, required: Role) {
  return roleRank[userRole] >= roleRank[required];
}
