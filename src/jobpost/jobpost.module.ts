import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Jobpost } from '../entities/jobpost.entity'
import { JobpostService } from './jobpost.service'

@Module({
    imports: [TypeOrmModule.forFeature([Jobpost])],
    providers: [JobpostService],
})
export class JobpostModule {}
