const axios = require('axios');
const cheerio = require('cheerio');

const getHtml = async () => {
	try {
		return await axios.get('https://www.saramin.co.kr/zf_user/search?search_area=main&search_done=y&search_optional_item=n&searchType=search&searchword=node')
	} catch (error) {
		console.log(error);
	}
};

getHtml()
	.then(html => {
		let jobList = [];
		const data = cheerio.load(html.data);
		const jobData = data('.item_recruit').children('div.area_job');

		jobData.each(function (i: number, elem: any) {
			jobList[i] = {
				title: this.find('.job_tit').text(),
				deadline_dtm: this.find('.date').text(),
			}
		})
		return jobList;
	})
	.then(res => console.log(res));