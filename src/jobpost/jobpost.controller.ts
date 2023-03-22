import {
    Controller,
    Get,
    Post,
    Query,
    Body,
    Param,
    Delete,
} from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { JobpostService } from './jobpost.service'

@Controller('api/jobpost')
export class JobpostController {
    constructor(private readonly jobpostService: JobpostService) {}

    @Cron('0 0 5 * * *') // 매일 새벽 5시
    @Get('/saramin')
    async getSaraminData() {
        return await this.jobpostService.getSaraminJobposts()
    }

    @Cron('0 0 4 * * *') // 매일 새벽 4시
    @Get('/wanted')
    async getWantedJobposts() {
        return await this.jobpostService.getWantedJobposts()
    }

    @Cron('0 0 3 * * *') // 매일 새벽 3시
    @Get('/programmers')
    async getProgrammersJobposts() {
        return await this.jobpostService.getProgrammersJobposts()
    }

    @Get('/filter/:userId')
    async getRecommendedJobposts(
        @Query()
        query: {
            sort?: string
            order?: string
            limit?: string
            offset?: string
        },
        @Param('userId') userId: number
    ) {
        console.log(userId)
        return await this.jobpostService.getRecommendedJobposts(query, userId)
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

    @Get('/keywords')
    async getKeywords() {
        return await this.jobpostService.getKeywords()
    }

    // 회원이 찜 하기 누른 채용공고 번호 리스트 가져오기
    @Get('/likes/:userId')
    async getUserLikeJobpostList(@Param('userId') userId: number) {
        return await this.jobpostService.getUserLikeJobpostList(userId)
    }

    // 찜 하기
    @Post('/:jobpostId/like')
    async createJobpostLike(
        @Body('userId') userId: number,
        @Param('jobpostId') jobpostId: number
    ) {
        return await this.jobpostService.createJobpostLike(userId, jobpostId)
    }

    // 찜 삭제
    @Delete('/:jobpostId/like')
    async deleteJobpostLike(
        @Body('userId') userId: number,
        @Param('jobpostId') jobpostId: number
    ) {
        return await this.jobpostService.deleteJobpostLike(userId, jobpostId)
    }

    // 채용공고 상세
    @Get('/:jobpostId')
    async getJobpostDetail(@Param('jobpostId') jobpostId: number) {
        return await this.jobpostService.getJobpostDetail(jobpostId)
    }

    //조회수 찾기
    @Get('/view/:jobpostId')
    async getViewJobpost(@Param('jobpostId') jobpostId: number) {
        return await this.jobpostService.getViewJobpost(jobpostId)
    }
}
