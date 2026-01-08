
export interface MessageConfig {
  targetDate: string;
  secretKeyword: string;
  sheetRowNo: number;
}

export type AppStatus = 'loading' | 'locked' | 'unlocked' | 'error' | 'idle';

export interface AppError {
  title: string;
  message: string;
}
