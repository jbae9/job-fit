import { Injectable } from '@nestjs/common'
import { JobpostRepository } from "./jobpost.repository";
import { SaraminScraper } from './jobpost.SaraminAxiosScraper'

@Injectable()
export class JobpostService {
	constructor(private jobpostRepository: JobpostRepository) { }

	async createJobpost() {
		const saraminScraper = new SaraminScraper(`https://www.saramin.co.kr/zf_user/search/recruit?search_area=main&search_done=y&search_optional_item=n&searchType=search&searchword=node&recruitPage=1&recruitSort=relation&recruitPageCount=10000&inner_com_type=&company_cd=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C9%2C10&show_applied=&quick_apply=&except_read=&ai_head_hunting=`);
		let jobList = await saraminScraper.getDataAsHtml()
		return await this.jobpostRepository.getSaraminData(jobList);
	}
}
