import { Controller, Post, Get } from '@nestjs/common'
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
}
