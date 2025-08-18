import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { GoalsModule } from './modules/goals/goals.module';
import { DatabaseModule } from './shared/database/database.module';
import { GoalsCompletedModule } from './modules/goals-completed/goals-completed.module';

import { validate } from './shared/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validate,
    }),
    GoalsModule,
    DatabaseModule,
    GoalsCompletedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
