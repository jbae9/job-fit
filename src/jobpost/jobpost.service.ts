import { Injectable } from '@nestjs/common'
import { JobpostRepository } from "./jobpost.repository";
import { SaraminScraper } from './jobpost.SaraminAxiosScraper'

@Injectable()
export class JobpostService {
	constructor(private jobpostRepository: JobpostRepository) { }

	async createJobpost() {
		const saraminScraper = new SaraminScraper(`https://www.saramin.co.kr/zf_user/jobs/list/job-category?page=1&cat_mcls=2&isAjaxRequest=0&page_count=10&sort=RL&type=job-category&is_param=1&isSearchResultEmpty=1&isSectionHome=0&searchParamCount=1#searchTitle`);
		let jobList = await saraminScraper.getDataAsHtml()
		return await this.jobpostRepository.getSaraminData(jobList);
	}
}
