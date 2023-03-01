import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Jobpost } from '../entities/jobpost.entity'
import { JobpostService } from './jobpost.service'
import { JobpostController } from './jobpost.controller'
import { JobpostRepository } from "./jobpost.repository";

@Module({
    controllers: [JobpostController],
    imports: [TypeOrmModule.forFeature([Jobpost])],
    providers: [JobpostService, JobpostRepository],
})
export class JobpostModule { }
