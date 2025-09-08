import { Test } from '@nestjs/testing';
import { type NestApplication } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';

import { Server } from 'http';

import { User } from 'src/modules/users/entities/user.entity';

import { GoalsCompletedSpecModule } from './goals-completed.spec.module';

import { PrismaService } from 'src/shared/database/prisma.service';

import { createTestUser } from 'src/shared/__tests__/helpers/create-test-user.helper';
import { createTestGoal } from 'src/shared/__tests__/helpers/create-test-goal.helper';
import { createTestGoalCompleted } from 'src/shared/__tests__/helpers/create-test-goal-completed.helper';

import { GoalsCompletedMockFactory } from '../__factories__/goals-completed-mock.factory';

import { JWT_SERVICE, PRISMA_SERVICE } from 'src/shared/constants/tokens';

describe('Goals Completed Module', () => {
  let app: NestApplication;
  let server: Server;

  let prismaService: PrismaService;
  let jwtService: JwtService;
  let accessToken: string;

  let activeUser: User;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [GoalsCompletedSpecModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    server = app.getHttpServer() as Server;

    prismaService = module.get(PRISMA_SERVICE);
    jwtService = module.get(JWT_SERVICE);
  });

  beforeEach(async () => {
    const result = await createTestUser({
      prismaService,
      jwtService,
    });

    activeUser = result.user;
    accessToken = result.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST', () => {
    describe('/goals-completed', () => {
      it('should to complete a goal', async () => {
        const goal = await createTestGoal({
          prismaService,
          userId: activeUser.id!,
        });

        const goalId = goal.id!;

        await createTestGoalCompleted({
          prismaService,
          goalId,
        });

        const response = await request(server)
          .post('/goals-completed')
          .send({ goalId })
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject({
          goalId,
        });
      });

      it('should to throw NotFound error when goal not exists', async () => {
        const response = await request(server)
          .post('/goals-completed')
          .send({ goalId: GoalsCompletedMockFactory.create.id() })
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
          message: 'Goal not exists!',
          error: 'Not Found',
          statusCode: 404,
        });
      });

      it('should to throw Conflit error when goal already total completed this week', async () => {
        const goal = await createTestGoal({
          prismaService,
          override: {
            desiredWeeklyFrequency: 1,
          },
          userId: activeUser.id!,
        });

        const goalId = goal.id!;

        await createTestGoalCompleted({
          prismaService,
          goalId,
        });

        const response = await request(server)
          .post('/goals-completed')
          .send({ goalId })
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.statusCode).toBe(409);
        expect(response.body).toEqual({
          message: 'Goal already completed this week',
          error: 'Conflict',
          statusCode: 409,
        });
      });
    });
  });
});
