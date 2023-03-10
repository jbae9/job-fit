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
        // eslint-disable-next-line prefer-const
        let { sort, order, limit, offset, ...others } = query
        sort = sort || 'recent'
        order = order || 'desc'
        const limitNum = parseInt(limit) || 16
        const offsetNum = parseInt(offset) || 0

        // this.logger.log(sort, order, limitNum, offsetNum, others)

        let orderObj: { [keys: string]: string }
        if (sort === 'recent') {
            orderObj = { updatedDtm: order.toUpperCase() }
        } else if (sort === 'popular') {
            orderObj = {}
        } else {
            orderObj = { updatedDtm: order.toUpperCase() }
        }

        // const test = await this.jobpostRepository.find({
        //     relations: {
        //         company: true,
        //         keywords: true,
        //         stacks: true,
        //         users: true,
        //     },
        //     select: {
        //         jobpostId: true,
        //         company: { companyName: true },
        //         originalImgUrl: true,
        //         title: true,
        //         // keywords: { keyword: true },
        //         // stacks: { stack: true, stackImgUrl: true },
        //         users: true,
        //         views: true,
        //         deadlineDtm: true,
        //         addressUpper: true,
        //         addressLower: true,
        //     },
        //     order: orderObj,
        //     take: limitNum,
        //     skip: offsetNum,
        // })

        // this.logger.log(test)

        return await this.jobpostRepository.getFilteredJobposts(
            sort,
            order,
            limitNum,
            offsetNum,
            others
        )
    }

    async getAddresses() {
        return await this.jobpostRepository.getAddresses()
    }

    async getStacks() {
        return await this.jobpostRepository.getStacks()
    }
}
