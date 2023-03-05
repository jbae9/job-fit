import { Injectable, Logger } from '@nestjs/common'
import { CompanyRepository } from 'src/company/company.repository'
import { JobpostRepository } from './jobpost.repository'
import { wantedScraper } from './jobpostWantedAxiosScraper'
import { SaraminScraper } from './jobpost.SaraminAxiosScraper'
import { jobpostKeywordParser } from './jobpostKeywordParser'

@Injectable()
export class JobpostService {
    constructor(
        private jobpostRepository: JobpostRepository,
        private companyRepository: CompanyRepository,
        private logger: Logger
    ) {}

    async createJobpost() {
        const saraminScraper = new SaraminScraper(
            `https://www.saramin.co.kr/zf_user/search/recruit?search_area=main&search_done=y&search_optional_item=n&searchType=search&searchword=node&recruitPage=1&recruitSort=relation&recruitPageCount=10000&inner_com_type=&company_cd=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C9%2C10&show_applied=&quick_apply=&except_read=&ai_head_hunting=`
        )
        let jobList = await saraminScraper.getDataAsHtml()
        return await this.jobpostRepository.getSaraminData(jobList)
    }

    async postWantedJobposts() {
        const { companies, jobposts } = await wantedScraper()
        await this.companyRepository.save(companies)

        for (let i = 0; i < jobposts.length; i++) {
            const companyId = await this.companyRepository.find({
                select: { companyId: true },
                where: { companyName: jobposts[i].companyName },
            })

            const saveResult = await this.jobpostRepository.save({
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

            this.logger.log(saveResult)

            // const {keywords, stacks} = await jobpostKeywordParser(jobposts[i].title, jobposts[i].content)
        }
    }
}
