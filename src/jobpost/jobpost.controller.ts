import { Controller, Get, Query } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { JobpostService } from './jobpost.service'

@Controller('api/jobpost')
export class JobpostController {
    constructor(private readonly jobpostService: JobpostService) {}

    @Cron('0 0 9,19 * * *') // 매일 오전 9시, 오후 7시
    @Get('/saramin')
    async getSaraminData() {
        return await this.jobpostService.getSaraminJobposts()
    }

    @Cron('0 30 9,19 * * *') // 매일 오전 9시30분, 오후 7시30분
    @Get('/wanted')
    async getWantedJobposts() {
        return await this.jobpostService.getWantedJobposts()
    }

    @Cron('0 0 10,20 * * *') // 매일 오전 10시, 오후 8시
    @Get('/programmers')
    async getProgrammersJobposts() {
        return await this.jobpostService.getProgrammersJobposts()
    }

    @Get('/filter')
    async getFilteredJobposts(
        @Query()
        query: {
            sort?: string
            order?: string
            limit?: string
            offset?: string
        }
    ) {
        return await this.jobpostService.getFilteredJobposts(query)
    }

    @Get('/addresses')
    async getAddresses() {
        return await this.jobpostService.getAddresses()
    }

    @Get('/stacks')
    async getStacks() {
        return await this.jobpostService.getStacks()
    }
}
