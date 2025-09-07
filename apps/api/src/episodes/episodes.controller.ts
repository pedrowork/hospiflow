import { Body, Controller, Get, Param, Post, Query, Delete } from '@nestjs/common';
import { EpisodesService } from './episodes.service';

@Controller('episodes')
export class EpisodesController {
	constructor(private readonly service: EpisodesService) {}

	@Get()
	list(@Query('userId') userId: string) {
		return this.service.list(userId);
	}

	@Get(':id')
	get(@Param('id') id: string) {
		return this.service.get(id);
	}

	@Post()
	create(@Body() body: any) {
		return this.service.create({
			userId: body.userId,
			hospitalName: body.hospitalName,
			sector: body.sector ?? null,
			bed: body.bed ?? null,
			patientName: body.patientName ?? null,
			patientBirth: body.patientBirth ? new Date(body.patientBirth) : null,
			type: body.type,
			startedAt: body.startedAt ? new Date(body.startedAt) : new Date(),
			isMotherBaby: !!body.isMotherBaby,
		});
	}

	@Post(':id/close')
	close(@Param('id') id: string, @Body() body: any) {
		return this.service.close(id, body.endedAt ? new Date(body.endedAt) : new Date());
	}

	@Delete('reset')
	reset(@Query('userId') userId: string) {
		return this.service.resetByUser(userId);
	}
}
