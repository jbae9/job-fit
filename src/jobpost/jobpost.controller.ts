import { Controller, Post, Get } from '@nestjs/common'
import { JobpostService } from './jobpost.service'

@Controller('api/jobpost')
export class JobpostController {
    constructor(private readonly jobpostService: JobpostService) {}

    @Get('/saramin')
    async getSaraminData() {
        return await this.jobpostService.getSaraminJobposts()
    }

    @Get('/wanted')
    async getWantedJobposts() {
        return await this.jobpostService.getWantedJobposts()
    }

    @Get('/programmers')
    async getProgrammersJobposts() {
        return await this.jobpostService.getProgrammersJobposts()
    }
}
