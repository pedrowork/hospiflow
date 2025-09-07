import { Controller, Post, Body } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('dev')
export class DevController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('seed')
  async seed(@Body() body: { userId?: string }) {
    const userId = body.userId || 'demo-user-1';
    const user = await this.prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, email: `${userId}@local`, name: 'Demo User', passwordHash: 'seed' },
    });
    const ep = await this.prisma.episode.create({
      data: {
        userId: user.id,
        hospitalName: 'Hospital Demo',
        type: 'clinica',
        startedAt: new Date(),
      },
    });
    const now = new Date();
    const earlier = new Date(now.getTime() - 15 * 60 * 1000);
    await this.prisma.event.createMany({
      data: [
        { episodeId: ep.id, type: 'call_nurse', occurredAt: earlier, notes: 'Campainha acionada' },
        { episodeId: ep.id, type: 'nurse_arrived', occurredAt: now, notes: 'Atendimento iniciado' },
      ],
    });
    return { ok: true, userId: user.id, episodeId: ep.id };
  }
}


