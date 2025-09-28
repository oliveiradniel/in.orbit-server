import { Test } from '@nestjs/testing';
import { type NestApplication } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';

import { Server } from 'http';

import { GoalsSpecModule } from './goals.spec.module';

import { PrismaService } from 'src/shared/database/prisma.service';

import { createTestUser } from 'src/shared/__tests__/helpers/int/create-test-user.helper';
import { createTestGoal } from 'src/shared/__tests__/helpers/int/create-test-goal.helper';
import { createTestGoalCompleted } from 'src/shared/__tests__/helpers/int/create-test-goal-completed.helper';
import { describeAuthGuard } from 'src/shared/__tests__/helpers/int/describe-auth-guard.helper';
import { describeUserNotExists } from 'src/shared/__tests__/helpers/int/describe-user-not-exists.helper';

import { GoalsMockFactory } from 'src/shared/__factories__/goals-mock.factory';

import { type User } from 'src/modules/users/entities/user.entity';
import { type WeeklyGoalsProgress } from 'src/shared/interfaces/goal/weekly-goals-progress.interface';
import { type WeeklyGoalsSummary } from 'src/shared/interfaces/goal/weekly-goals-summary.interface';
import { type GoalsWithTotal } from 'src/shared/interfaces/goal/goal-without-user-id.interface';

import { JWT_SERVICE, PRISMA_SERVICE } from 'src/shared/constants/tokens';

describe('Goals Module', () => {
  let app: NestApplication;
  let server: Server;

  let prismaService: PrismaService;
  let jwtService: JwtService;
  let accessToken: string;

  let activeUser: User;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [GoalsSpecModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    server = app.getHttpServer() as Server;

    prismaService = module.get<PrismaService>(PRISMA_SERVICE);
    jwtService = module.get<JwtService>(JWT_SERVICE);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    const result = await createTestUser({
      prismaService,
      jwtService,
    });

    activeUser = result.user;
    accessToken = result.accessToken;
  });

  describe('GET', () => {
    describe('/goals', () => {
      it('should to return the weekly goals with completion', async () => {
        const goal = await createTestGoal({
          prismaService,
          userId: activeUser.id!,
        });

        const response = await request(server)
          .get('/goals')
          .set('Authorization', `Bearer ${accessToken}`);

        const responseBodyArray = response.body as WeeklyGoalsProgress[];

        expect(response.statusCode).toBe(200);
        expect(responseBodyArray[0]).toMatchObject({
          id: goal.id,
          title: goal.title,
          desiredWeeklyFrequency: goal.desiredWeeklyFrequency,
          completionCount: 0,
        });
      });

      it('should return empty array if no goals exists', async () => {
        const response = await request(server)
          .get('/goals')
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
      });

      describeUserNotExists({
        getServer: () => server,
        getJWTService: () => jwtService,
        route: '/goals',
      });

      describeAuthGuard({
        getServer: () => server,
        route: '/goals',
      });
    });

    describe('/goals/summary', () => {
      it('should to return the weekly goals summary', async () => {
        const [goal1, goal2] = await createTestGoal({
          prismaService,
          userId: activeUser.id!,
          override: {
            title: 'Acordar cedo',
            desiredWeeklyFrequency: 7,
          },
          otherGoals: [{ title: 'Estudar', desiredWeeklyFrequency: 5 }],
        });

        const weekStartsAt = GoalsMockFactory.create.weekStartsAt();

        const firstDayOfWeek = weekStartsAt.toDate();
        const secondDayOfWeek = weekStartsAt.add(1, 'day').toDate();
        const thirdDayOfWeek = weekStartsAt.add(2, 'day').toDate();

        await createTestGoalCompleted({
          prismaService,
          goalId: goal1.id!,
          createdAt: firstDayOfWeek,
          otherGoalsCompleted: [
            {
              goalId: goal1.id!,
              createdAt: secondDayOfWeek,
            },
            {
              goalId: goal2.id!,
              createdAt: thirdDayOfWeek,
            },
          ],
        });

        const response = await request(server)
          .get('/goals/summary')
          .query({ weekStartsAt: weekStartsAt.toDate().toISOString() })
          .set('Authorization', `Bearer ${accessToken}`);

        const weeklyGoalsSummary = response.body as WeeklyGoalsSummary;

        expect(response.statusCode).toBe(200);
        expect(weeklyGoalsSummary).toMatchObject({
          completed: 3,
          total: 12,
        });

        expect(weeklyGoalsSummary.goalsPerDay).toMatchObject({
          [weekStartsAt.format('YYYY-MM-DD')]: [
            {
              title: 'Acordar cedo',
            },
          ],
          [weekStartsAt.add(1, 'day').format('YYYY-MM-DD')]: [
            {
              title: 'Acordar cedo',
            },
          ],
          [weekStartsAt.add(2, 'day').format('YYYY-MM-DD')]: [
            {
              title: 'Estudar',
            },
          ],
        });
      });

      describe('Without any goals completed', () => {
        it('should return 0 completed and correct total with created goals', async () => {
          await createTestGoal({
            prismaService,
            userId: activeUser.id!,
            override: {
              desiredWeeklyFrequency: 7,
            },
            otherGoals: [
              {
                title: 'Estudar',
                desiredWeeklyFrequency: 5,
              },
            ],
          });

          const response = await request(server)
            .get('/goals/summary')
            .query({
              weekStartsAt: GoalsMockFactory.create
                .weekStartsAt()
                .toDate()
                .toISOString(),
            })
            .set('Authorization', `Bearer ${accessToken}`);

          expect(response.statusCode).toBe(200);
          expect(response.body).toMatchObject({
            completed: 0,
            total: 12,
            goalsPerDay: null,
          });
        });

        it('should return 0 completed and correct total without created goals', async () => {
          const response = await request(server)
            .get('/goals/summary')
            .query({
              weekStartsAt: GoalsMockFactory.create
                .weekStartsAt()
                .toDate()
                .toISOString(),
            })
            .set('Authorization', `Bearer ${accessToken}`);

          expect(response.statusCode).toBe(200);
          expect(response.body).toMatchObject({
            completed: 0,
            total: null,
            goalsPerDay: null,
          });
        });
      });

      describeUserNotExists({
        getServer: () => server,
        getJWTService: () => jwtService,
        route: '/goals/summary',
      });

      describeAuthGuard({
        getServer: () => server,
        route: '/goals/summary',
      });
    });

    describe('/goals/all', () => {
      it('should to return all goals by active user when goals exists', async () => {
        await createTestGoal({
          prismaService,
          userId: activeUser.id!,
          otherGoals: [
            {
              title: GoalsMockFactory.create.title(),
              desiredWeeklyFrequency: 1,
            },
            {
              title: GoalsMockFactory.create.title(),
              desiredWeeklyFrequency: 1,
            },
          ],
        });

        const response = await request(server)
          .get('/goals/all')
          .set('Authorization', `Bearer ${accessToken}`);

        const goalsWithTotal = response.body as GoalsWithTotal;

        expect(response.statusCode).toBe(200);
        expect(goalsWithTotal.total).toBe(3);
        expect(goalsWithTotal.goals).toHaveLength(3);

        goalsWithTotal.goals.forEach((goal) => {
          expect(typeof goal.id).toBe('string');
          expect(typeof goal.title).toBe('string');
          expect(typeof goal.desiredWeeklyFrequency).toBe('number');
          expect(typeof goal.createdAt).toBe('string');
        });
      });

      it('should to return all goals by active user when not exists goals', async () => {
        const response = await request(server)
          .get('/goals/all')
          .set('Authorization', `Bearer ${accessToken}`);

        const goalsWithTotal = response.body as GoalsWithTotal;

        expect(response.statusCode).toBe(200);
        expect(goalsWithTotal.total).toBe(0);
        expect(goalsWithTotal.goals).toHaveLength(0);

        expect(goalsWithTotal.goals).toStrictEqual([]);
      });

      describeUserNotExists({
        getServer: () => server,
        getJWTService: () => jwtService,
        route: '/goals/all',
      });

      describeAuthGuard({
        getServer: () => server,
        route: '/goals/all',
      });
    });
  });

  describe('POST', () => {
    describe('/goals', () => {
      it('should to create a goal', async () => {
        const response = await request(server)
          .post('/goals')
          .send({ title: 'Estudar', desiredWeeklyFrequency: 5 })
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject({
          userId: activeUser.id,
          title: 'Estudar',
          desiredWeeklyFrequency: 5,
        });
      });

      describeUserNotExists({
        getServer: () => server,
        getJWTService: () => jwtService,
        getData: () => ({ title: 'Acordar cedo', desiredWeeklyFrequency: 7 }),
        route: '/goals',
        method: 'post',
      });

      describeAuthGuard({
        getServer: () => server,
        route: '/goals',
        method: 'post',
      });
    });
  });
});
