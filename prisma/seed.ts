import { prismaClient } from 'src/lib/prismaClient';

import dayjs from 'dayjs';

async function main() {
  const goalId1 = crypto.randomUUID();
  const goalId2 = crypto.randomUUID();
  const goalId3 = crypto.randomUUID();

  await prismaClient.goalCompleted.deleteMany();
  await prismaClient.goal.deleteMany();

  await prismaClient.goal.createMany({
    data: [
      {
        id: goalId1,
        title: 'Acordar cedo',
        desiredWeeklyFrequency: 5,
      },
      {
        id: goalId2,
        title: 'Me exercitar',
        desiredWeeklyFrequency: 3,
      },
      {
        id: goalId3,
        title: 'Meditar',
        desiredWeeklyFrequency: 1,
        createdAt: new Date(2025, 7, 18),
      },
    ],
  });

  const startOfWeek = dayjs().startOf('week');

  await prismaClient.goalCompleted.createMany({
    data: [
      { goalId: goalId1, createdAt: startOfWeek.toDate() },
      { goalId: goalId1, createdAt: startOfWeek.add(1, 'day').toDate() },
      { goalId: goalId1, createdAt: startOfWeek.add(2, 'day').toDate() },
      { goalId: goalId1, createdAt: startOfWeek.add(3, 'day').toDate() },
      { goalId: goalId1, createdAt: startOfWeek.add(4, 'day').toDate() },
      { goalId: goalId3, createdAt: startOfWeek.add(1, 'day').toDate() },
    ],
  });
}

main()
  .then(() => console.log('✅ Seed concluído!'))
  .catch((err) => {
    console.error('❌ Erro no seed:', err);
  });
