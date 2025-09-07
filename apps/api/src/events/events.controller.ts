import { Body, Controller, Get, Param, Post, Query, Patch } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly service: EventsService) {}

  @Get()
  list(@Query('episodeId') episodeId: string) {
    return this.service.list(episodeId);
  }

  @Post()
  create(@Body() body: any) {
    return this.service.create({
      episodeId: body.episodeId,
      type: body.type,
      occurredAt: body.occurredAt ? new Date(body.occurredAt) : new Date(),
      plannedAt: body.plannedAt ? new Date(body.plannedAt) : null,
      locationLabel: body.locationLabel ?? null,
      gpsLat: body.gpsLat ?? null,
      gpsLng: body.gpsLng ?? null,
      severity: body.severity ?? null,
      notes: body.notes ?? null,
    });
  }

  @Patch(':id/notes')
  patchNotes(@Param('id') id: string, @Body() body: { notes?: string | null }) {
    return this.service.updateNotes(id, body.notes ?? null);
  }
}


