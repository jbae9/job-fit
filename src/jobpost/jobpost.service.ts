import { Injectable, Logger } from '@nestjs/common'
import { CompanyRepository } from 'src/company/company.repository'
import { JobpostRepository } from './jobpost.repository'
import { wantedScraper } from './scraper/jobpostWantedAxiosScraper'
import { SaraminSelenium } from './scraper/jobpostSaraminSeleniumScraper'
import { programmersScraper } from './scraper/jobpostProgrammersScraper'
import { CacheService } from 'src/cache/cache.service'

@Injectable()
export class JobpostService {
    constructor(
        private jobpostRepository: JobpostRepository,
        private companyRepository: CompanyRepository,
        private cacheService: CacheService,
        private logger: Logger
    ) { }
    async getSaraminJobposts() {
        const saraminScraper = new SaraminSelenium('100')
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

    async getKeywords() {
        return await this.jobpostRepository.getKeywords()
    }

    async postLike(userId: number, jobpostId: number) {
        let likes = await this.cacheService.getLikedjobpost(jobpostId)
        console.log(likes)
        if (likes[0] == jobpostId.toString() && likes[1] == userId.toString()) {
            await this.cacheService.delLikedjobpost(jobpostId, userId)
            setTimeout(() => {
                this.jobpostRepository.deleteLike(userId, jobpostId)
            }, 3000)
        } else {
            await this.cacheService.setLikedjobpost(jobpostId, userId)
            setTimeout(() => {
                this.jobpostRepository.insertLike(userId, jobpostId)
            }, 3000)
        }
        return 'success'
    }

    // 채용공고 상세정보
    async getJobpostDetail(jobpostId: number) {
        return await this.jobpostRepository.getJobpostDetail(jobpostId)
    }
}
