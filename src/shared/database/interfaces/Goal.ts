export interface WeeklyGoalsWithCompletionResponse {
  id: string;
  title: string;
  desiredWeeklyFrequency: number;
  completionCount: number;
}

export interface WeeklySummaryOfCompletedGoalsResponse {
  completed: number;
  total: number;
  goalsPerDay: Record<
    string,
    {
      id: string;
      title: string;
      completedAt: Date;
    }[]
  >;
}

export interface WeeklyFrequencyAndCompletionCountParams {
  goalId: string;
  firstDayOfWeek: Date;
  lastDayOfWeek: Date;
}

export interface WeeklySummaryOfCompletedGoalsParams {
  firstDayOfWeek: Date;
  lastDayOfWeek: Date;
}
