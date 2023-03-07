import { DataSource, Repository } from 'typeorm'
import { Jobpost } from 'src/entities/jobpost.entity'
import { Injectable } from '@nestjs/common'
import { CompanyRepository } from 'src/company/company.repository'

@Injectable()
export class JobpostRepository extends Repository<Jobpost> {
    constructor(
        private dataSource: DataSource,
        private companyRepository: CompanyRepository
    ) {
        super(Jobpost, dataSource.createEntityManager())
    }

    async postJobpostsInBulk(jobposts) {
        await this.createQueryBuilder()
            .insert()
            .into(Jobpost)
            .values(jobposts)
            .execute()
    }
    async createJobposts(jobposts) {
        // 공고 데이터 한번씩 돌면서
        for (let jobpost of jobposts) {
            const {
                companyName,
                title,
                content,
                salary,
                originalSiteName,
                originalUrl,
                originalImgUrl,
                postedDtm,
                deadlineDtm,
            } = jobpost

            const companyId = await this.companyRepository.findCompanyId(
                companyName
            )

            const query = `INSERT INTO jobpost (company_id, title, content, salary, original_site_name, original_url, original_img_url, posted_dtm, deadline_dtm)
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                           ON DUPLICATE KEY UPDATE
                           title = COALESCE(?, title),
                           content = COALESCE(?, content),
                           salary = COALESCE(?, salary),
                           original_site_name = COALESCE(?, original_site_name),
                           original_url = COALESCE(?, original_url),
                           original_img_url = COALESCE(?, original_img_url),
                           posted_dtm = COALESCE(?, posted_dtm),
                           deadline_dtm = COALESCE(?, deadline_dtm)`

            const values = [
                companyId,
                title,
                content,
                salary,
                originalSiteName,
                originalUrl,
                originalImgUrl,
                postedDtm,
                deadlineDtm,
                title,
                content,
                salary,
                originalSiteName,
                originalUrl,
                originalImgUrl,
                postedDtm,
                deadlineDtm,
            ]

            await this.query(query, values)
        }
    }
}
