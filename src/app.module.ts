import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { GoalsModule } from './modules/goals/goals.module';
import { DatabaseModule } from './shared/database/database.module';
import { GoalsCompletedModule } from './modules/goals-completed/goals-completed.module';

import { validate } from './shared/config/configuration';
import { OauthModule } from './modules/oauth/oauth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validate,
    }),
    GoalsModule,
    DatabaseModule,
    GoalsCompletedModule,
    OauthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
