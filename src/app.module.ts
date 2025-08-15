import { Module } from '@nestjs/common';
import { GoalsModule } from './modules/goals/goals.module';
import { DatabaseModule } from './shared/database/database.module';

@Module({
  imports: [GoalsModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
