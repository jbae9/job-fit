import { Injectable } from '@nestjs/common'
import { JobpostRepository } from "./jobpost.repository";
import { saraminSelenium } from './jobpostSaraminSeleniumScraper'

@Injectable()
export class JobpostService {
	constructor(private jobpostRepository: JobpostRepository) { }

	async createJobpost() {
		const saraminScraper = new saraminSelenium();
		let jobList = await saraminScraper.getSaraminScraper()
		return await this.jobpostRepository.getSaraminData(jobList);
	}
}
