import { Test } from '@nestjs/testing';
import { NestApplication } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';

import { Server } from 'http';

import { User } from 'src/modules/users/entities/user.entity';
import { GoalsSpecModule } from './goals.spec.module';

import { GoalsRepository } from 'src/shared/contracts/goals.repository.contract';
import { UsersRepository } from 'src/shared/contracts/users-repository.contract';

import { PrismaService } from 'src/shared/database/prisma.service';

import { createTestUser } from 'src/shared/__tests__/helpers/create-test-user.helper';

import { describeAuthGuard } from 'src/shared/__tests__/helpers/describe-auth-guard.helper';

import {
  GOALS_REPOSITORY,
  JWT_SERVICE,
  PRISMA_SERVICE,
  USERS_REPOSITORY,
} from 'src/shared/constants/tokens';

import { WeeklyGoalsProgress } from 'src/shared/interfaces/goals/weekly-goals-progress.interface';

import { WeeklyGoalsSummary } from 'src/shared/interfaces/goals/weekly-goals-summary.interface';
import dayjs from 'dayjs';
import { describeUserNotExists } from 'src/shared/__tests__/helpers/describe-user-not-exists.helper';

describe('Goals Module', () => {
  let app: NestApplication;
  let server: Server;

  let prismaService: PrismaService;
  let jwtService: JwtService;
  let accessToken: string;

  let usersRepository: UsersRepository;
  let goalsRepository: GoalsRepository;

  let activerUser: User;

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

    usersRepository = module.get(USERS_REPOSITORY);
    goalsRepository = module.get(GOALS_REPOSITORY);

    prismaService = module.get(PRISMA_SERVICE);
    jwtService = module.get(JWT_SERVICE);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    const result = await createTestUser({
      usersRepository,
      prismaService,
      jwtService,
      override: {
        id: crypto.randomUUID(),
      },
    });
    activerUser = result.user;
    accessToken = result.accessToken;
  });

  describe('GET', () => {
    describe('/goals', () => {
      it('should to return the weekly goals with completion', async () => {
        const createdGoal = await goalsRepository.create(activerUser.id!, {
          title: 'Acordar cedo',
          desiredWeeklyFrequency: 7,
        });

        const response = await request(server)
          .get('/goals')
          .set('Authorization', `Bearer ${accessToken}`);

        const responseBodyArray = response.body as WeeklyGoalsProgress[];

        expect(response.statusCode).toBe(200);
        expect(responseBodyArray[0]).toMatchObject({
          id: createdGoal.id,
          title: createdGoal.title,
          desiredWeeklyFrequency: createdGoal.desiredWeeklyFrequency,
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
        const createdGoal1 = await goalsRepository.create(activerUser.id!, {
          title: 'Acordar cedo',
          desiredWeeklyFrequency: 7,
        });

        const createdGoal2 = await goalsRepository.create(activerUser.id!, {
          title: 'Estudar',
          desiredWeeklyFrequency: 5,
        });

        const startOfWeek = dayjs().startOf('week');

        const firstDayOfWeek = startOfWeek.toDate();
        const secondDayOfWeek = startOfWeek.add(1, 'day').toDate();
        const thirdDayOfWeek = startOfWeek.add(2, 'day').toDate();

        await prismaService.goalCompleted.createMany({
          data: [
            { goalId: createdGoal1.id!, createdAt: firstDayOfWeek },
            {
              goalId: createdGoal1.id!,
              createdAt: secondDayOfWeek,
            },
            {
              goalId: createdGoal2.id!,
              createdAt: thirdDayOfWeek,
            },
          ],
        });

        const response = await request(server)
          .get('/goals/summary')
          .set('Authorization', `Bearer ${accessToken}`);

        const weeklyGoalsSummary = response.body as WeeklyGoalsSummary;

        expect(response.statusCode).toBe(200);
        expect(weeklyGoalsSummary).toMatchObject({
          completed: 3,
          total: 12,
        });

        expect(weeklyGoalsSummary.goalsPerDay).toMatchObject({
          [startOfWeek.format('YYYY-MM-DD')]: [
            {
              title: 'Acordar cedo',
            },
          ],
          [startOfWeek.add(1, 'day').format('YYYY-MM-DD')]: [
            {
              title: 'Acordar cedo',
            },
          ],
          [startOfWeek.add(2, 'day').format('YYYY-MM-DD')]: [
            {
              title: 'Estudar',
            },
          ],
        });
      });

      describe('Without any goals completed', () => {
        it('should return 0 completed and correct total with created goals', async () => {
          await goalsRepository.create(activerUser.id!, {
            title: 'Acordar cedo',
            desiredWeeklyFrequency: 7,
          });

          await goalsRepository.create(activerUser.id!, {
            title: 'Estudar',
            desiredWeeklyFrequency: 5,
          });

          const response = await request(server)
            .get('/goals/summary')
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
          userId: activerUser.id,
          title: 'Estudar',
          desiredWeeklyFrequency: 5,
        });
      });

      describeUserNotExists({
        getServer: () => server,
        getJWTService: () => jwtService,
        route: '/goals',
        method: 'post',
        data: { title: 'Acordar cedo', desiredWeeklyFrequency: 7 },
      });

      describeAuthGuard({
        getServer: () => server,
        route: '/goals',
        method: 'post',
      });
    });
  });
});
