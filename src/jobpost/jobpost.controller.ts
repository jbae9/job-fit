import { Controller, Post, Get, Query } from '@nestjs/common'
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

    @Get('/filter')
    async getFilteredJobposts(
        @Query() query: { order?: string; limit?: string; offset?: string }
    ) {
        return await this.jobpostService.getFilteredJobposts(query)
    }
}
