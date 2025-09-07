import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  list(episodeId: string) {
    return this.prisma.event.findMany({ where: { episodeId }, orderBy: { occurredAt: 'desc' } });
  }

  create(data: {
    episodeId: string;
    type: string;
    occurredAt: Date;
    plannedAt?: Date | null;
    locationLabel?: string | null;
    gpsLat?: number | null;
    gpsLng?: number | null;
    severity?: string | null;
    notes?: string | null;
  }) {
    return this.prisma.event.create({ data });
  }

  updateNotes(id: string, notes: string | null) {
    return this.prisma.event.update({ where: { id }, data: { notes } });
  }
}


