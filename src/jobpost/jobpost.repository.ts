import { DataSource, Repository } from 'typeorm'
import { Jobpost } from 'src/entities/jobpost.entity'
import { Injectable } from '@nestjs/common'

@Injectable()
export class JobpostRepository extends Repository<Jobpost> {
    constructor(private dataSource: DataSource) {
        super(Jobpost, dataSource.createEntityManager())
    }

    async postJobpostsInBulk(jobposts) {
        await this.createQueryBuilder()
            .insert()
            .into(Jobpost)
            .values(jobposts)
            .execute()
    }
}
