const axios = require('axios');
const cheerio = require('cheerio');

export class SaraminScraper {
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
		let html = await this.getHtml(this.url)
		let allJobsArr = [];
		const data = cheerio.load(html.data);
		const jobData = data('.list_body').children('div');
		// console.log(jobData.html())

		jobData.each(async function (i: number, elem: any) {
			const title = data(elem).find('.job_tit a span').text();
			const url = data(elem).find('.job_tit a').attr("href");
			const deadlineDtm = data(elem).find('.deadlines').text()

			allJobsArr.push({
				"title": title,
				"content": "",
				"salary": 0,
				"originalSiteName": "사람인",
				"originalUrl": url,
				"originalImageUrl": "image",
				"deadlineDtm": deadlineDtm,
				//String(deadlineDtm).substring(2)
				// "addressUpper": addressUpper,
				// "addressLower": addressLower,
				// "career": career,
				// "education": education,
				// "worktype": worktype,
			})
		})
		return allJobsArr;
	}
}