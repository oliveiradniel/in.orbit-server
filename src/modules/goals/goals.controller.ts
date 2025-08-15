import { Controller, Get, Post } from '@nestjs/common';
import { GoalsService } from './goals.service';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  async findWeekGoals() {}

  @Post()
  async create() {}
}
