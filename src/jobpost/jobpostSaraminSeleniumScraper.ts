import { Builder, By, Key, until, WebDriver } from 'selenium-webdriver'
import { Options } from 'selenium-webdriver/chrome'
import { PageLoadStrategy } from 'selenium-webdriver/lib/capabilities'
import { SaraminScraper } from './jobpostSaraminAxiosScraper'
require('chromedriver')
const companyOption = {
	"기업형태": "corporateType",
	"사원수": "numberEmployees",
	"설립일": "foundedYear",
	"매출액": "annualSales",
	"대표자명": "representativeName",
	"홈페이지": "homepageUrl",
	"기업주소": "address"
}
let companyNum = 0

async function getSaraminScraper() {
	const options = new Options()
	options.setPageLoadStrategy(PageLoadStrategy.NORMAL)
	options.excludeSwitches('enable-logging')

	const driver = await new Builder()
		.forBrowser('chrome')
		.setChromeOptions(options)
		.build()
	const saraminScraper = new SaraminScraper(`https://www.saramin.co.kr/zf_user/jobs/list/job-category?page=1&cat_mcls=2&isAjaxRequest=0&page_count=4&sort=RL&type=job-category&is_param=1&isSearchResultEmpty=1&isSectionHome=0&searchParamCount=1#searchTitle`);
	let allJobsArr = await saraminScraper.getDataAsHtml()
	let allCompanies = [{
		"companyName": null,
		"representativeName": null,
		"numberEmployees": null,
		"address": null,
		"foundedYear": null,
		"imageUrl": null,
		"homepageUrl": null,
		"annualSales": null,
		"avgSalary": null,
		"kreditjobUrl": null,
		"corporateType": null,
	}]
	try {
		for (let i = 0; i < allJobsArr.length; i++) {
			console.log(companyNum)
			await driver.get(
				`https://www.saramin.co.kr${allJobsArr[i].originalUrl}`)
			const allJobs = await driver.findElement(
				By.css(`.wrap_jview > section:nth-child(1)`)
			)
			let salary = '0'
			let salaryText = await allJobs
				.findElement(By.className('jv_summary'))
				.findElement(By.css('.cont > .col:nth-child(2) > dl:first-child > dt'))
				.getText()
			if (salaryText === '급여') {
				salary = await allJobs
					.findElement(By.className('jv_summary'))
					.findElement(By.css('.cont > .col:nth-child(2) > dl:first-child > dd'))
					.getText()
				if (salary === '면접 후 결정') {
					salary = '0'
				} else {
					salary = salary.split(' ', 2)[1]
				}
			}
			const postedDtm = await allJobs
				.findElement(By.className('info_period'))
				.findElement(By.css('dd'))
				.getText()
			allJobsArr[i].postedDtm = new Date(postedDtm)
			allJobsArr[i].salary = Number(salary)
			allJobsArr[i].deadlineDtm == '채용' ? null : new Date(String(new Date().getFullYear) + '/' + allJobsArr[i].deadlineDtm)
			let companyName = await allJobs
				.findElement(By.className('title_inner'))
				.findElement(By.css('.company'))
			console.log(await companyName.getAttribute('href'))
			if (companyName.getAttribute('href')) {
				const companyOptionList = await allJobs
					.findElement(By.className('wrap_info'))
					.findElements(By.css('.info > dl'))
				for (i = 0; i < companyOptionList.length; i++) {
					const option = await companyOptionList[i].findElement(By.css('dt')).getText()
					const optionText = await companyOptionList[i].findElement(By.css('dd')).getText()
					for (const key in companyOption) {
						if (option.indexOf(key) !== -1) {
							allCompanies[companyNum][`${companyOption[key]}`] = optionText
							break
						}
					}
				}
				if (allCompanies[companyNum]["numberEmployees"] != null) {
					allCompanies[companyNum]["numberEmployees"] = Number(allCompanies[companyNum]["numberEmployees"].split(' ', 1)[0])
				}
				if (allCompanies[companyNum]["foundedYear"] != null) {
					const isoDateString = allCompanies[companyNum]["foundedYear"]?.split('(')[0].replace(/(\d{4})년\s(\d{1,2})월\s(\d{1,2})일/, "$1$2$3")
					allCompanies[companyNum]["foundedYear"] = Number(isoDateString)
				}
			}
			allCompanies[companyNum]["companyName"] = await companyName.getText()

			if (i != allJobsArr.length - 1) {
				companyNum++
				allCompanies.push({
					"companyName": null,
					"representativeName": null,
					"numberEmployees": null,
					"address": null,
					"foundedYear": null,
					"imageUrl": null,
					"homepageUrl": null,
					"annualSales": null,
					"avgSalary": null,
					"kreditjobUrl": null,
					"corporateType": null,
				})
			}
		}
	} catch (err) {
		console.log(err)
	} finally {
		await driver.quit()
		console.log(allCompanies)
		return { companies: allCompanies, jobposts: allJobsArr }
	}
}

getSaraminScraper();
