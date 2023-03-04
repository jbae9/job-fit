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
            .orIgnore()
            .execute()
    }

    async createCompanies(companies) {
        // 회사 데이터 한번씩 돌면서
        companies.map(async (company) => {
            const {
                companyName,
                representativeName,
                numberEmployees,
                address,
                foundedYear,
                imageUrl,
                hompageUrl,
                annualSales,
                avgSalary,
                kerditjobUrl,
                corperateType,
            } = company

            const query = `INSERT INTO company (company_name, representative_name, number_employees, address, founded_year, image_url, homepage_url, annual_sales, avg_salary, kreditjob_url, corporate_type)
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                           ON DUPLICATE KEY UPDATE
                           representative_name = COALESCE(?, representative_name),
                           address = COALESCE(?, address),
                           founded_year = COALESCE(?, founded_year),
                           image_url = COALESCE(?, image_url),
                           homepage_url = COALESCE(?, homepage_url),
                           annual_sales = COALESCE(?, annual_sales),
                           kreditjob_url = COALESCE(?, kreditjob_url),
                           corporate_type = COALESCE(?, corporate_type)`

            const values = [
                companyName,
                representativeName,
                numberEmployees,
                address,
                foundedYear,
                imageUrl,
                hompageUrl,
                annualSales,
                avgSalary,
                kerditjobUrl,
                corperateType,
                representativeName,
                address,
                foundedYear,
                imageUrl,
                hompageUrl,
                annualSales,
                kerditjobUrl,
                corperateType,
            ]

            await this.query(query, values)
        })
    }
}
