import { Module } from '@nestjs/common';
import { GoalsModule } from './modules/goals/goals.module';
import { DatabaseModule } from './shared/database/database.module';
import { GoalsCompletedModule } from './modules/goals-completed/goals-completed.module';

@Module({
  imports: [GoalsModule, DatabaseModule, GoalsCompletedModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
