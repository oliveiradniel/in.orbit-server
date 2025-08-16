export interface GetWeeklyGoalsWithCompletionResponse {
  id: string;
  title: string;
  desiredWeeklyFrequency: number;
  completionCount: number;
}

export interface GetWeeklyFrequencyAndCompletionCountParams {
  goalId: string;
  firstDayOfWeek: Date;
  lastDayOfWeek: Date;
}
