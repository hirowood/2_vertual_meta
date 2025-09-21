// Enumの定義をTypeScriptの定数として管理
// SQLiteはEnumをサポートしないため、文字列定数として扱う

export const Role = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  ADMIN: 'ADMIN',
} as const;
export type Role = typeof Role[keyof typeof Role];

export const RoomType = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
  LESSON: 'LESSON',
  EVENT: 'EVENT',
} as const;
export type RoomType = typeof RoomType[keyof typeof RoomType];

export const RoomRole = {
  OWNER: 'OWNER',
  MODERATOR: 'MODERATOR',
  MEMBER: 'MEMBER',
} as const;
export type RoomRole = typeof RoomRole[keyof typeof RoomRole];

export const MessageType = {
  TEXT: 'TEXT',
  SYSTEM: 'SYSTEM',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
} as const;
export type MessageType = typeof MessageType[keyof typeof MessageType];

export const AttendanceStatus = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
  EXCUSED: 'EXCUSED',
  HOLIDAY: 'HOLIDAY',
} as const;
export type AttendanceStatus = typeof AttendanceStatus[keyof typeof AttendanceStatus];

// ヘルパー関数
export const isValidRole = (role: string): role is Role => {
  return Object.values(Role).includes(role as Role);
};

export const isValidRoomType = (type: string): type is RoomType => {
  return Object.values(RoomType).includes(type as RoomType);
};

export const isValidRoomRole = (role: string): role is RoomRole => {
  return Object.values(RoomRole).includes(role as RoomRole);
};

export const isValidMessageType = (type: string): type is MessageType => {
  return Object.values(MessageType).includes(type as MessageType);
};

export const isValidAttendanceStatus = (status: string): status is AttendanceStatus => {
  return Object.values(AttendanceStatus).includes(status as AttendanceStatus);
};
