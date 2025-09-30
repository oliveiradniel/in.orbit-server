export interface Goal {
  id?: string;
  userId: string;
  title: string;
  desiredWeeklyFrequency: number;
  isDeleted: boolean;
  createdAt: Date;
}
