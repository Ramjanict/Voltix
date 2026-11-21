export const ROLE = {
  ADMIN: "ADMIN",
  GENERAL: "GENERAL",
} as const;

export type UserRole = (typeof ROLE)[keyof typeof ROLE];

export default ROLE;
