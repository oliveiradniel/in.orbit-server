import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';

import { Server } from 'http';

import { UsersSpecModule } from './users.spec.module';

import { PrismaService } from 'src/shared/database/prisma.service';

import { createTestUser } from 'src/shared/__tests__/helpers/int/create-test-user.helper';
import { createTestGoal } from 'src/shared/__tests__/helpers/int/create-test-goal.helper';
import { describeAuthGuard } from 'src/shared/__tests__/helpers/int/describe-auth-guard.helper';
import { describeUserNotExists } from 'src/shared/__tests__/helpers/int/describe-user-not-exists.helper';

import { type User } from '../entities/user.entity';

import { GoalsMockFactory } from 'src/shared/__factories__/goals-mock.factory';

import { JWT_SERVICE, PRISMA_SERVICE } from 'src/shared/constants/tokens';

describe('Users Module', () => {
  let app: INestApplication;
  let server: Server;

  let prismaService: PrismaService;
  let jwtService: JwtService;

  let activeUser: User;
  let accessToken: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [UsersSpecModule],
    }).compile();

    app = module.createNestApplication<INestApplication>();
    await app.init();

    server = app.getHttpServer() as Server;

    prismaService = module.get<PrismaService>(PRISMA_SERVICE);
    jwtService = module.get<JwtService>(JWT_SERVICE);

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

  describe('GET', () => {
    describe('/users', () => {
      it('shoud to get the authenticated user', async () => {
        const response = await request(server)
          .get('/users')
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.statusCode).toEqual(200);
        expect(response.body).toMatchObject({
          id: activeUser.id,
          avatarURL: activeUser.avatarURL,
        });
      });

      describeUserNotExists({
        getServer: () => server,
        getJWTService: () => jwtService,
        route: '/users',
      });

      describeAuthGuard({
        getServer: () => server,
        route: '/users',
      });
    });

    describe('/users/gamification', () => {
      it('should to get correct level and XP from authenticated user', async () => {
        const [goal1, goal2, goal3, goal4, goal5] = await createTestGoal({
          prismaService,
          userId: activeUser.id!,
          override: {
            desiredWeeklyFrequency: 2,
          },
          otherGoals: [
            {
              title: GoalsMockFactory.create.title(),
              desiredWeeklyFrequency: 2,
            },
            {
              title: GoalsMockFactory.create.title(),
              desiredWeeklyFrequency: 1,
            },
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

        const goals = [goal1, goal2, goal3, goal4, goal5];

        for (const goal of goals) {
          await request(server)
            .post('/goals-completed')
            .send({ goalId: goal.id! })
            .set('Authorization', `Bearer ${accessToken}`);
        }

        const response = await request(server)
          .get('/users/gamification')
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.statusCode).toEqual(200);
        expect(response.body).toMatchObject({
          level: 2,
          experiencePoints: 31,
          experienceToNextLevel: 59,
        });
      });

      describeUserNotExists({
        getServer: () => server,
        getJWTService: () => jwtService,
        route: '/users/gamification',
      });

      describeAuthGuard({
        getServer: () => server,
        route: '/users/gamification',
      });
    });
  });

  describe('DELETE', () => {
    describe('/users', () => {
      it('should delete the active user', async () => {
        const response = await request(server)
          .delete('/users')
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.statusCode).toEqual(204);
      });

      describeUserNotExists({
        getServer: () => server,
        getJWTService: () => jwtService,
        route: '/users',
        httpMethod: 'delete',
      });

      describeAuthGuard({
        getServer: () => server,
        route: '/users',
        httpMethod: 'delete',
      });
    });
  });
});
