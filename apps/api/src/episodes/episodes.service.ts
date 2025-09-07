import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EpisodesService {
	constructor(private readonly prisma: PrismaService) {}

	list(userId: string) {
		return this.prisma.episode.findMany({ where: { userId }, orderBy: { startedAt: 'desc' } });
	}

	async get(id: string) {
		const ep = await this.prisma.episode.findUnique({ where: { id } });
		if (!ep) throw new NotFoundException('Episode not found');
		return ep;
	}

	create(data: {
		userId: string;
		hospitalName: string;
		sector?: string | null;
		bed?: string | null;
		patientName?: string | null;
		patientBirth?: Date | null;
		type: string;
		startedAt: Date;
		isMotherBaby?: boolean;
	}) {
		return this.ensureUser(data.userId).then(async (userId) => {
			return this.prisma.episode.create({ data: { ...data, userId } });
		});
	}

	close(id: string, endedAt: Date) {
		return this.prisma.episode.update({ where: { id }, data: { endedAt } });
	}

	async resetByUser(userId: string) {
		const episodes = await this.prisma.episode.findMany({ where: { userId }, select: { id: true } });
		const episodeIds = episodes.map(e => e.id);
		if (episodeIds.length === 0) {
			return { deletedEpisodes: 0 };
		}
		const events = await this.prisma.event.findMany({ where: { episodeId: { in: episodeIds } }, select: { id: true } });
		const eventIds = events.map(e => e.id);
		await this.prisma.evidence.deleteMany({ where: { OR: [ { episodeId: { in: episodeIds } }, { eventId: { in: eventIds } } ] } });
		await this.prisma.timer.deleteMany({ where: { episodeId: { in: episodeIds } } });
		await this.prisma.checklist.deleteMany({ where: { episodeId: { in: episodeIds } } });
		await this.prisma.request.deleteMany({ where: { episodeId: { in: episodeIds } } });
		await this.prisma.event.deleteMany({ where: { episodeId: { in: episodeIds } } });
		const reports = await this.prisma.report.findMany({ where: { episodeId: { in: episodeIds } }, select: { id: true } });
		const reportIds = reports.map(r => r.id);
		await this.prisma.share.deleteMany({ where: { reportId: { in: reportIds } } });
		await this.prisma.report.deleteMany({ where: { id: { in: reportIds } } });
		await this.prisma.episode.deleteMany({ where: { id: { in: episodeIds } } });
		return { deletedEpisodes: episodeIds.length };
	}

	private async ensureUser(userId: string): Promise<string> {
		const exists = await this.prisma.user.findUnique({ where: { id: userId } });
		if (exists) return userId;
		const passwordHash = await bcrypt.hash(`dev-${userId}-${Date.now()}`, 10);
		await this.prisma.user.create({
			data: {
				id: userId,
				email: `${userId}@local`,
				name: 'Dev User',
				passwordHash,
			},
		});
		return userId;
	}
}
