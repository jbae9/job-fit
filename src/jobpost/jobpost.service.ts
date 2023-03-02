import { Injectable, Logger } from '@nestjs/common'
import { CompanyRepository } from 'src/company/company.repository'
import { JobpostRepository } from './jobpost.repository'
import { wantedScraper } from './jobpostWantedAxiosScraper'

@Injectable()
export class JobpostService {
    constructor(
        private jobpostRepository: JobpostRepository,
        private companyRepository: CompanyRepository,
        private logger: Logger
    ) {}

    async postWantedJobposts() {
        const { companies, jobposts } = await wantedScraper()
        await this.companyRepository.save(companies)

        for (let i = 0; i < jobposts.length; i++) {
            const companyId = await this.companyRepository.find({
                select: { companyId: true },
                where: { companyName: jobposts[i].companyName },
            })
            this.logger.log(companyId)

            await this.jobpostRepository.save({
                companyId: companyId[0].companyId,
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
