import { DataSource, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Company } from 'src/entities/company.entity'

@Injectable()
export class CompanyRepository extends Repository<Company> {
    constructor(private dataSource: DataSource) {
        super(Company, dataSource.createEntityManager())
    }

    // 회사 번호 가지고 오는 함수
    async findCompanyId(companyName: String) {
        const company = await this.createQueryBuilder('company')
            .where({ companyName: companyName })
            .getOne()
        return company.companyId
    }

    async createCompanies(companies) {
        // 회사 데이터 한번씩 돌면서
        for (let company of companies) {
            const {
                companyName,
                representativeName,
                numberEmployees,
                address,
                foundedYear,
                imageUrl,
                homepageUrl,
                annualSales,
                avgSalary,
                kreditjobUrl,
                corporateType,
            } = company

            const query = `INSERT INTO company (company_name, representative_name, number_employees, address, founded_year, image_url, homepage_url, annual_sales, avg_salary, kreditjob_url, corporate_type)
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                           ON DUPLICATE KEY UPDATE
                            number_employees = ?,
                            avg_salary = ?,
                            representative_name = COALESCE(representative_name, ?),
                            address = COALESCE(address, ?),
                            founded_year = COALESCE(founded_year, ?),
                            image_url = COALESCE(image_url, ?),
                            homepage_url = COALESCE(homepage_url, ?),
                            annual_sales = COALESCE(annual_sales, ?),
                            kreditjob_url = COALESCE(kreditjob_url, ?),
                            corporate_type = COALESCE(corporate_type, ?)`

            const values = [
                companyName,
                representativeName,
                numberEmployees,
                address,
                foundedYear,
                imageUrl,
                homepageUrl,
                annualSales,
                avgSalary,
                kreditjobUrl,
                corporateType,
                numberEmployees,
                avgSalary,
                representativeName,
                address,
                foundedYear,
                imageUrl,
                homepageUrl,
                annualSales,
                kreditjobUrl,
                corporateType,
            ]

            await this.query(query, values)
        }
    }
}
