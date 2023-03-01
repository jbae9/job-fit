import { DataSource, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Company } from 'src/entities/company.entity'

@Injectable()
export class CompanyRepository extends Repository<Company> {
    constructor(private dataSource: DataSource) {
        super(Company, dataSource.createEntityManager())
    }

    async postCompaniesInBulk(companies) {
        await this.createQueryBuilder()
            .insert()
            .into(Company)
            .values(companies)
            .orUpdate(['number_employees'])
            .execute()
    }
}
