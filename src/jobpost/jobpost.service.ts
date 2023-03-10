import { Injectable, Logger } from '@nestjs/common'
import { CompanyRepository } from 'src/company/company.repository'
import { JobpostRepository } from './jobpost.repository'
import { wantedScraper } from './scraper/jobpostWantedAxiosScraper'
import { SaraminSelenium } from './scraper/jobpostSaraminSeleniumScraper'
import { programmersScraper } from './scraper/jobpostProgrammersScraper'

@Injectable()
export class JobpostService {
    constructor(
        private jobpostRepository: JobpostRepository,
        private companyRepository: CompanyRepository,
        private logger: Logger
    ) {}

    async getSaraminJobposts() {
        const saraminScraper = new SaraminSelenium('10')
        const { companies, jobposts } = await saraminScraper.getSaraminScraper()

        // 회사 데이터 넣기
        await this.companyRepository.createCompanies(companies)

        // 채용공고 데이터 넣기
        await this.jobpostRepository.createJobposts(jobposts)
    }

    async getWantedJobposts() {
        const { companies, jobposts } = await wantedScraper()

        // 회사 데이터 넣기
        await this.companyRepository.createCompanies(companies)

        // 채용공고 데이터 넣기
        await this.jobpostRepository.createJobposts(jobposts)
    }

    async getProgrammersJobposts() {
        const { jobposts, companiesSetArray } = await programmersScraper()

        // 회사 데이터 넣기
        await this.companyRepository.createCompanies(companiesSetArray)

        // 채용공고 데이터 넣기
        await this.jobpostRepository.createJobposts(jobposts)
    }

    async getFilteredJobposts(query: {
        sort?: string
        order?: string
        limit?: string
        offset?: string
    }) {
        const sort = query.sort || 'recent'
        const order = query.order || 'desc'
        const limit = parseInt(query.limit) || 16
        const offset = parseInt(query.offset) || 0

        // this.logger.log([order, orderBy, limit, offset])
        return await this.jobpostRepository.getFilteredJobposts(
            sort,
            order,
            limit,
            offset
        )
    }
}
