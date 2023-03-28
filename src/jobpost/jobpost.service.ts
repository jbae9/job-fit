import { Injectable, Logger } from '@nestjs/common'
import { CompanyRepository } from 'src/company/company.repository'
import { JobpostRepository } from './jobpost.repository'
import { wantedScraper } from './scraper/jobpostWantedAxiosScraper'
import { SaraminSelenium } from './scraper/jobpostSaraminSeleniumScraper'
import { programmersScraper } from './scraper/jobpostProgrammersScraper'
import { CacheService } from 'src/cache/cache.service'
import { Cron } from '@nestjs/schedule'

@Injectable()
export class JobpostService {
    constructor(
        private jobpostRepository: JobpostRepository,
        private companyRepository: CompanyRepository,
        private cacheService: CacheService,
        private logger: Logger
    ) {}
    async getSaraminJobposts() {
        let saraminScraper = new SaraminSelenium(
            this.companyRepository,
            this.jobpostRepository
        )
        saraminScraper.getSaraminScraper('50')
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

    async getRecommendedJobposts(
        query: {
            sort?: string
            order?: string
            limit?: string
            offset?: string
        },
        userId
    ) {
        // eslint-disable-next-line prefer-const
        let { sort, order, limit, offset, ...others } = query
        sort = sort || 'recommended'
        order = order || 'desc'
        const limitNum = parseInt(limit) || 16
        const offsetNum = parseInt(offset) || 0

        // 메인화면 최신순, 마감순 12개 요청 일 때
        if (['recent', 'ending'].includes(sort) && limit === '12') {
            // 캐시에 존재하는지 확인
            const isCached = await this.cacheService.isCachedMainJobposts(sort)

            if (isCached) {
                // 존재할 때
                const mainJobposts = await this.cacheService.getMainJobposts(
                    sort
                )

                return JSON.parse(mainJobposts)
            } else {
                // 존재하지 않을 떄 캐싱
                const mainJobposts =
                    await this.jobpostRepository.getFilteredJobposts(
                        sort,
                        order,
                        limitNum,
                        offsetNum,
                        others
                    )
                // 메인화면 인기순 채용공고 12개 캐싱, 만료기간 하루
                await this.cacheService.setMainJobposts(sort, mainJobposts)

                return mainJobposts
            }
        }

        return await this.jobpostRepository.getRecommendedJobposts(
            sort,
            order,
            limitNum,
            offsetNum,
            others,
            userId
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

    // 회원이 찜 누른 채용공고 리스트 번호 가져오기
    async getUserLikeJobpostList(userId: number) {
        return await this.jobpostRepository.getUserLikeJobpostList(userId)
    }

    // 찜 하기
    async createJobpostLike(userId: number, jobpostId: number) {
        try {
            await this.cacheService.setLikedjobpost(jobpostId, userId)
            return { message: '찜 목록에 추가했습니다.' }
        } catch (err) {
            console.log(err)
            return { message: '찜 목록 추가에 실패했습니다.' }
        }
    }

    // 찜 삭제
    async deleteJobpostLike(userId: number, jobpostId: number) {
        try {
            // 찜 누른 데이터가 아직 DB에 반영되지 않아서 redis 에 있는지 없는지 체크
            // DB에 반영되지 않았을때 찜 취소를 하는 경우를 대비
            const isLikedJobpost = await this.cacheService.isLikedjobpost(
                jobpostId,
                userId
            )

            if (isLikedJobpost === 1) {
                // 아직 반영되지 않고 있다면? Redis에서만 삭제
                await this.cacheService.remOneLikedjobpost(jobpostId, userId)
            } else {
                // 이미 반영되어서 없다면? DB에서 삭제
                await this.jobpostRepository.deleteLike(userId, jobpostId)
            }

            return { message: '찜 목록에서 삭제했습니다.' }
        } catch (err) {
            console.log(err)
            return { message: '찜 목록 삭제에 실패했습니다.' }
        }
    }

    // redis에 있는 찜 눌린 채용공고를 DB에 반영
    // 서버시간 매 10초마다 반영
    @Cron('*/5 * * * * *')
    async jobpostLikeInsert() {
        const likedJobposts = await this.cacheService.getAllLikedjobpost()

        // 찜 눌린 정보가 없을 때
        if (likedJobposts.length === 0) return

        // 있다면
        // DB에 반영
        await this.jobpostRepository.insertLike(likedJobposts.join(','))

        // DB 반영하고 redis 데이터 제거
        await this.cacheService.remLikedjobpost()
        console.log('좋아요 redis 제거완료')
    }

    // 채용공고 상세정보
    async getJobpostDetail(jobpostId: number) {
        return await this.jobpostRepository.getJobpostDetail(jobpostId)
    }

    async getViewJobpost(jobpostId: number) {
        return await this.jobpostRepository.getViewJobpost(jobpostId)
    }

    @Cron('*/5 * * * * *')
    async jobpostViewInsert() {
        const viewJobposts = Object.entries(
            await this.cacheService.getAllViews()
        )
        if (viewJobposts.length === 0) return

        const values = viewJobposts
            .map(([jobpostId, viewCount]) => `${jobpostId}, ${viewCount}`)
            .join('/')
        await this.jobpostRepository.updateView(values)

        await this.cacheService.remViewjobpost()
        console.log('조회수 redis 제거완료')
    }
}
