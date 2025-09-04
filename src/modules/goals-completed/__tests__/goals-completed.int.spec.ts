import { Test } from '@nestjs/testing';
import { type NestApplication } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';

import { Server } from 'http';

import { User } from 'src/modules/users/entities/user.entity';
import { Goal } from 'src/modules/goals/entities/goal.entity';

import { GoalsCompletedSpecModule } from './goals-completed.spec.module';

import { UsersRepository } from 'src/shared/contracts/users-repository.contract';
import { GoalsRepository } from 'src/shared/contracts/goals.repository.contract';

import { PrismaService } from 'src/shared/database/prisma.service';

import { createTestUser } from 'src/shared/__tests__/helpers/create-test-user.helper';

import {
  GOALS_REPOSITORY,
  JWT_SERVICE,
  PRISMA_SERVICE,
  USERS_REPOSITORY,
} from 'src/shared/constants/tokens';

describe('Goals Completed Module', () => {
  let app: NestApplication;
  let server: Server;

  let prismaService: PrismaService;
  let jwtService: JwtService;
  let accessToken: string;

  let usersRepository: UsersRepository;
  let goalsRepository: GoalsRepository;

  let activeUser: User;
  let createdGoal: Goal;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [GoalsCompletedSpecModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    server = app.getHttpServer() as Server;

    usersRepository = module.get(USERS_REPOSITORY);
    goalsRepository = module.get(GOALS_REPOSITORY);

    prismaService = module.get(PRISMA_SERVICE);
    jwtService = module.get(JWT_SERVICE);
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

    activeUser = result.user;
    accessToken = result.accessToken;

    createdGoal = await goalsRepository.create(activeUser.id!, {
      title: 'Acordar cedo',
      desiredWeeklyFrequency: 7,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST', () => {
    describe('/goals-completed', () => {
      it('should to complete a goal', async () => {
        const response = await request(server)
          .post('/goals-completed')
          .send({ goalId: createdGoal.id })
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject({
          goalId: createdGoal.id,
        });
      });

      it('should to throw NotFound error when goal not exists', async () => {
        const response = await request(server)
          .post('/goals-completed')
          .send({ goalId: crypto.randomUUID() })
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
          message: 'Goal not exists!',
          error: 'Not Found',
          statusCode: 404,
        });
      });

      it('should to throw Conflit error when goal already total completed this week', async () => {
        const createdGoal2 = await prismaService.goal.create({
          data: {
            userId: activeUser.id!,
            title: 'Acordar cedo',
            desiredWeeklyFrequency: 1,
          },
        });

        await prismaService.goalCompleted.create({
          data: {
            goalId: createdGoal2.id,
          },
        });

        const response = await request(server)
          .post('/goals-completed')
          .send({ goalId: createdGoal2.id })
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
