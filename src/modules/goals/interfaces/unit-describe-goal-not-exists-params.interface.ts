import { vi } from 'vitest';

export interface UnitDescribeGoalNotExistsParams {
  request: () => Promise<any>;
  classMethod: string;
  mockNotCalled: ReturnType<typeof vi.fn>;
}
