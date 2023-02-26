import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JobPost } from './job-post.entity'
import { JobPostService } from './job-post.service'

@Module({
    imports: [TypeOrmModule.forFeature([JobPost])],
    providers: [JobPostService],
})
export class JobPostModule {}
