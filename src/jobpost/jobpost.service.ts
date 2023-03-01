import { Injectable } from '@nestjs/common'
import { CompanyRepository } from 'src/company/company.repository'
import { JobpostRepository } from './jobpost.repository'
import { wantedScraper } from './jobpostWantedAxiosScraper'

@Injectable()
export class JobpostService {
    constructor(
        private jobpostRepository: JobpostRepository,
        private companyRepository: CompanyRepository
    ) {}

    async postWantedJobposts() {
        const { companies, jobposts } = await wantedScraper()
        await this.companyRepository.postCompaniesInBulk(companies)

        for (let i = 0; i < jobposts.length; i++) {
            const companyId = await this.companyRepository.find({
                select: { companyId: true },
                where: { companyName: jobposts[i].companyName },
            })

            await this.jobpostRepository.postJobpostsInBulk({
                companyId: companyId,
                title: jobposts[i].title,
                content: jobposts[i].content,
                salary: jobposts[i].salary,
                originalSiteName: jobposts[i].originalSiteName,
                originalUrl: jobposts[i].originalUrl,
                originalImgUrl: jobposts[i].originalImgUrl,
                postedDtm: jobposts[i].postedDtm,
                deadlineDtm: jobposts[i].deadlineDtm,
            })
        }
    }
}
