export const ROLES = {
  STUDENT: 'Student',
  TEACHER: 'Teacher',
  SUPER_ADMIN: 'SuperAdmin',
  ADMIN: 'Admin',
};

export const CONST = {
  MIN_USERNAME: 3,
  MAX_USERNAME: 46,
  MAX_EMAIL: 48,
  MIN_PASSWORD_LENGTH: 6,
  MAX_ID_LENGTH: 10,
  MIN_STUDENT_ID: 6,
  MAX_STUDENT_ID: 12,
  MIN_ADDRESS: 4,
  MAX_ADDRESS: 100,
};

export const REGX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

export const periodPattern = new RegExp(
  '^period-(0[1-9]|1[0-9]|2[0-9]|3[1-9]|4[0-9]|5[0-9]|60)$',
  'i'
);
