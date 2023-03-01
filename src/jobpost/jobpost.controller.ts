import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
} from "@nestjs/common";
import { JobpostService } from './jobpost.service'

@Controller('api/jobpost')
export class JobpostController {
	constructor(private readonly jobpostService: JobpostService) { }

	@Get('/saramin')
	async getSaraminData() {
		return await this.jobpostService.createJobpost();
	}
}
