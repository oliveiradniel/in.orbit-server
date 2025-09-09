export interface DateRangeFilter {
  firstDayOfWeek: Date;
  lastDayOfWeek: Date;
}

export interface UserDateRangeFilter extends DateRangeFilter {
  userId: string;
}

export interface GoalDateRangeFilter extends DateRangeFilter {
  goalId: string;
}
