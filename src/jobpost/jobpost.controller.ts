import { Controller, Post, Get, Query } from '@nestjs/common'
import { JobpostService } from './jobpost.service'

@Controller('api/jobpost')
export class JobpostController {
    constructor(private readonly jobpostService: JobpostService) {}

    @Post('/wanted')
    async postWantedJobposts() {
        return this.jobpostService.postWantedJobposts()
    }

    @Get('/saramin')
    async getSaraminData() {
        return await this.jobpostService.postSaraminJobposts()
    }

    @Get('/programmers')
    async getProgrammersJobposts() {
        return await this.jobpostService.createProgrammersJobposts()
    }

    @Get('/recent')
    async getRecentJobposts() {
        return await this.jobpostService.getRecentJobposts()
    }

    @Get('/filter')
    async getFilteredJobposts(
        @Query() query: { order?: string; limit?: string; offset?: string }
    ) {
        return await this.jobpostService.getFilteredJobposts(query)
    }
}
