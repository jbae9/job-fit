import { Controller, Post } from '@nestjs/common'
import { JobpostService } from './jobpost.service'

@Controller('api/jobpost')
export class JobpostController {
    constructor(private readonly jobpostService: JobpostService) {}

    @Post('/wanted')
    async postWantedJobposts() {
        return this.jobpostService.postWantedJobposts()
    }
}
