export type GoalStatus = 'not started' | 'started' | 'completed';

export interface WeeklyGoalsProgress {
  id: string;
  title: string;
  desiredWeeklyFrequency: number;
  completionCount: number;
  status: GoalStatus;
}
