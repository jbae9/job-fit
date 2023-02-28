const axios = require('axios');
const cheerio = require('cheerio');

async function getHtml(url: string) {
	try {
		return await axios.get(url)
	} catch (error) {
		console.log(error);
	}
};


async function getDataAsHtml() {
	let html = await getHtml(`https://www.saramin.co.kr/zf_user/search/recruit?search_area=main&search_done=y&search_optional_item=n&searchType=search&searchword=node&recruitPage=1&recruitSort=relation&recruitPageCount=1&inner_com_type=&company_cd=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C9%2C10&show_applied=&quick_apply=&except_read=&ai_head_hunting=`)
	let jobList = [];
	const data = cheerio.load(html.data);
	const jobData = data('.content').children('div');

	jobData.each(async function (i: number, elem: any) {
		const title = data(elem).find('.job_tit a span').text();
		const companyName = data(elem).find('.corp_name a').text();
		const url = data(elem).find('.job_tit a').attr("href");
		const deadlineDtm = data(elem).find('.job_date .date').text();
		const addressUpper = data(elem).find('.job_condition > span:nth-child(1) > a:nth-child(1)').text();
		const addressLower = data(elem).find('.job_condition > span:nth-child(1) > a:nth-child(2)').text();
		const career = data(elem).find('.job_condition > span:nth-child(2)').text()
		const education = data(elem).find('.job_condition > span:nth-child(3)').text()
		const worktype = data(elem).find('.job_condition > span:nth-child(4)').text()

		// 상세 페이지 공고 스크랩 안됨 (null 나옴)
		// getHtml('https://www.saramin.co.kr' + url)
		// 	.then((data) => {
		// 		const detailData = cheerio.load(data.data);
		// 		console.log(detailData.html())
		// 		const detailJobData = detailData('.wrap_jview').find('section:nth-child(1)');
		// 		console.log('-------------------------------')
		// 		console.log(detailJobData.html());

		// 		const salary = detailJobData.find('.jv_cont.jv_summary > div > div:nth-child(2) > dl:nth-child(1) > dd').text();
		// 	});
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
	console.log(jobList);
	return jobList;
}