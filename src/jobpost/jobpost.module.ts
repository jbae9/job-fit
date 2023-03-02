import { Logger, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CompanyRepository } from 'src/company/company.repository'
import { Jobpost } from '../entities/jobpost.entity'
import { JobpostController } from './jobpost.controller'
import { JobpostRepository } from './jobpost.repository'
import { JobpostService } from './jobpost.service'

@Module({
    imports: [TypeOrmModule.forFeature([Jobpost])],
    controllers: [JobpostController],
    providers: [JobpostService, JobpostRepository, CompanyRepository, Logger],
})
export class JobpostModule {}
