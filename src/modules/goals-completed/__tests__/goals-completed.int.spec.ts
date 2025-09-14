import { Test } from '@nestjs/testing';
import { type NestApplication } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import request from 'supertest';

import { Server } from 'http';

import { GoalsCompletedSpecModule } from './goals-completed.spec.module';

import { PrismaService } from 'src/shared/database/prisma.service';

import dayjs from 'dayjs';

import { createTestUser } from 'src/shared/__tests__/helpers/create-test-user.helper';
import { createTestGoal } from 'src/shared/__tests__/helpers/create-test-goal.helper';
import { createTestGoalCompleted } from 'src/shared/__tests__/helpers/create-test-goal-completed.helper';

import { GoalsCompletedMockFactory } from '../__factories__/goals-completed-mock.factory';

import { type User } from 'src/modules/users/entities/user.entity';

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

    prismaService = module.get<PrismaService>(PRISMA_SERVICE);
    jwtService = module.get<JwtService>(JWT_SERVICE);

    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-09-10T10:00:00Z'));
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
    vi.useRealTimers();
    await app.close();
  });

  describe('POST', () => {
    describe('/goals-completed', () => {
      it('should to complete a goal', async () => {
        const goal = await createTestGoal({
          prismaService,
          userId: activeUser.id!,
          override: {
            desiredWeeklyFrequency: 2,
          },
        });

        const goalId = goal.id!;

        const response = await request(server)
          .post('/goals-completed')
          .send({ goalId })
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject({
          goalId,
        });
      });

      it('should add 5 XP when there is still 1 or more completions left in the week', async () => {
        const userId = activeUser.id!;

        const goal1 = await createTestGoal({
          prismaService,
          userId,
          override: {
            desiredWeeklyFrequency: 2,
          },
        });

        const goalId = goal1.id!;

        const initialXP = activeUser.experiencePoints;

        const response = await request(server)
          .post('/goals-completed')
          .send({ goalId: goalId })
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.statusCode).toBe(201);

        const updatedUser = await prismaService.user.findUnique({
          where: { id: userId },
        });

        expect(updatedUser?.experiencePoints).toBe(initialXP + 5);
      });

      it('should add 7 XP when this completion reaches the weekly frequency', async () => {
        const userId = activeUser.id!;

        const goal1 = await createTestGoal({
          prismaService,
          userId,
          override: {
            desiredWeeklyFrequency: 1,
          },
        });

        const goalId = goal1.id!;

        const initialXP = activeUser.experiencePoints;

        const response = await request(server)
          .post('/goals-completed')
          .send({ goalId: goalId })
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.statusCode).toBe(201);

        const updatedUser = await prismaService.user.findUnique({
          where: { id: userId },
        });

        expect(updatedUser?.experiencePoints).toBe(initialXP + 7);
      });

      it('should to throw BadRequest error when the goal has already been completed today', async () => {
        const yesterday = dayjs().subtract(1, 'day').toDate();

        const goal = await createTestGoal({
          prismaService,
          override: {
            desiredWeeklyFrequency: 2,
            createdAt: yesterday,
          },
          userId: activeUser.id!,
        });

        const goalId = goal.id!;

        await createTestGoalCompleted({
          prismaService,
          goalId,
          createdAt: yesterday,
        });

        await createTestGoalCompleted({
          prismaService,
          goalId,
          createdAt: dayjs().toDate(),
        });

        const response = await request(server)
          .post('/goals-completed')
          .send({ goalId })
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
          message: 'This goal has already been completed today.',
          error: 'Bad Request',
          statusCode: 400,
        });
      });

      it('should to throw NotFound error when goal not exists', async () => {
        const response = await request(server)
          .post('/goals-completed')
          .send({ goalId: GoalsCompletedMockFactory.create.id() })
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
          message: 'Goal not exists.',
          error: 'Not Found',
          statusCode: 404,
        });
      });

      it('should to throw Conflit error when goal already total completed this week', async () => {
        const yesterday = dayjs().subtract(1, 'day').toDate();

        const goal = await createTestGoal({
          prismaService,
          override: {
            desiredWeeklyFrequency: 1,
            createdAt: yesterday,
          },
          userId: activeUser.id!,
        });

        const goalId = goal.id!;

        await createTestGoalCompleted({
          prismaService,
          goalId,
          createdAt: yesterday,
        });

        const response = await request(server)
          .post('/goals-completed')
          .send({ goalId })
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.statusCode).toBe(409);
        expect(response.body).toEqual({
          message: 'Goal already completed this week.',
          error: 'Conflict',
          statusCode: 409,
        });
      });
    });
  });
});
