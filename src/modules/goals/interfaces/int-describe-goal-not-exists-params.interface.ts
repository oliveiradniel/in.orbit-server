import Test from 'supertest/lib/test';

import { type HTTPMethods } from 'src/shared/interfaces/http-methods.interface';

export interface IntDescribeGoalNotExistsParams {
  request: () => Test;
  httpMethod: HTTPMethods;
  route: string;
}
