import { Injectable, Logger } from '@nestjs/common'
import { CompanyRepository } from 'src/company/company.repository'
import { JobpostRepository } from './jobpost.repository'
import { wantedScraper } from './jobpostWantedAxiosScraper'
import { SaraminSelenium } from './jobpostSaraminSeleniumScraper'

@Injectable()
export class JobpostService {
	constructor(
		private jobpostRepository: JobpostRepository,
		private companyRepository: CompanyRepository,
		private logger: Logger
	) { }

	async postSaraminJobposts() {
		const saraminScraper = new SaraminSelenium('1000');
		const { companies, jobposts } = await saraminScraper.getSaraminScraper()
		for (let i = 0; i < jobposts.length; i++) {
			let companyId = await this.companyRepository.findOne({
				where: { companyName: companies[i].companyName },
			})
			if (!companyId) {	//회사 중복 확인
				await this.companyRepository.save(companies[i])
				companyId = await this.companyRepository.findOne({
					where: { companyName: companies[i].companyName },
				})
			}
			let jobpostId = await this.jobpostRepository.findOne({
				where: { originalUrl: jobposts[i].originalUrl },
			})
			if (!jobpostId) { //공고 중복 확인
				await this.jobpostRepository.save({
					companyId: companyId.companyId,
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
		this.logger.log('사람인 크롤링 작업 완료')
	}

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
