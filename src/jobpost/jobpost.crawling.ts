const axios = require('axios');
const cheerio = require('cheerio');

class crawlingData {
	url: string
	constructor(url: string) {
		this.url = url;
	}
	async getHtml(url: string) {
		try {
			return await axios.get(url)
		} catch (error) {
			console.log(error);
		}
	};


	async getDataAsHtml() {
		let html = await this.getHtml(`https://www.saramin.co.kr/zf_user/search/recruit?search_area=main&search_done=y&search_optional_item=n&searchType=search&searchword=node&recruitPage=1&recruitSort=relation&recruitPageCount=2&inner_com_type=&company_cd=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C9%2C10&show_applied=&quick_apply=&except_read=&ai_head_hunting=`)
		let jobList = [];
		const data = cheerio.load(html.data);
		const jobData = data('.content').children('div');
		// console.log(jobData.html())

		jobData.each(async function (i: number, elem: any) {
			const title = data(elem).find('.job_tit a span').text();
			const companyName = data(elem).find('.corp_name a').text();
			const url = data(elem).find('.job_tit a').attr("href");
			let startIdx = url.indexOf('?') + 26
			let id = url.substring(startIdx, Number(startIdx) + 8)
			console.log(id)
			const deadlineDtm = data(elem).find('.job_date .date').text();
			const addressUpper = data(elem).find('.job_condition > span:nth-child(1) > a:nth-child(1)').text();
			const addressLower = data(elem).find('.job_condition > span:nth-child(1) > a:nth-child(2)').text();
			const career = data(elem).find('.job_condition > span:nth-child(2)').text()
			const education = data(elem).find('.job_condition > span:nth-child(3)').text()
			const worktype = data(elem).find('.job_condition > span:nth-child(4)').text()

			// 상세 페이지 공고 스크랩 안됨 (null 나옴)
			// let urlData = await getHtml(`https://www.saramin.co.kr/zf_user/jobs/relay/view?isMypage=no&rec_idx=` + id + `&recommend_ids=eJxNj8sNw1AIBKvJnYXld04h7r%2BL4EjPWJxGDCuW7EaKXgV88ksHw8wPst2bcZX2jbAZ1EG2pfnKCTZ68L%2FVhs7xI1elth1ZWaFZR3a4jPFElWtgcWILr69s7BdSPHorAKaLAk3Bykl6vwqmECtXTKlFrVFu%2FAFujUBG&view_type=search&searchword=node&searchType=search&gz=1&t_ref_content=generic&t_ref=search&paid_fl=n&search_uuid=0df31496-013c-48cd-a164-0490dcec9d28#seq=0`)
			// const detailData = cheerio.load(urlData.data);
			// const detailJobData = detailData('.wrap_jview').children('section');
			// console.log(detailData.html())
			// detailJobData.each(async function (i: number, elem: any) {
			// 	// console.log('-------------------------------')
			// 	// console.log(detailJobData.html());
			// 	console.log(detailData(elem).html())
			// })
			// const salary = detailJobData.find('.jv_cont.jv_summary > div > div:nth-child(2) > dl:nth-child(1) > dd').text();
			jobList.push({
				"title": title,
				"deadlineDtm": String(deadlineDtm).substring(2),
				"originalSiteName": "saramin",
				"original_url": url,
				"addressUpper": addressUpper,
				"addressLower": addressLower,
				"career": career,
				"education": education,
				"worktype": worktype,
				"companyName": companyName.trim()
			})
		})
		return jobList;
	}
}