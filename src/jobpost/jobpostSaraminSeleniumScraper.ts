import { Builder, By, Key, until, WebDriver } from 'selenium-webdriver'
import { Options } from 'selenium-webdriver/chrome'
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


export class saraminSelenium {
	async getSaraminScraper() {
		const options = new Options()
		options.setPageLoadStrategy('normal')
		options.excludeSwitches('enable-logging')

		const driver = await new Builder()
			.forBrowser('chrome')
			.setChromeOptions(options)
			.build()
		const saraminScraper = new SaraminScraper(`https://www.saramin.co.kr/zf_user/jobs/list/job-category?page=1&cat_mcls=2&isAjaxRequest=0&page_count=2&sort=RL&type=job-category&is_param=1&isSearchResultEmpty=1&isSectionHome=0&searchParamCount=1#searchTitle`);
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
				const companyName = await allJobs
					.findElement(By.className('wrap_info'))
					.findElement(By.css('.title > span'))
					.getText()
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
				// companyName = await allJobs
				// 	.findElement(By.className('title_inner'))
				// 	.findElement(By.className('company'))
				// 	.getText()
				allCompanies[companyNum]["companyName"] = companyName
				if (allCompanies[companyNum]["numberEmployees"] != null) {
					allCompanies[companyNum]["numberEmployees"] = Number(allCompanies[companyNum]["numberEmployees"].split(' ', 1)[0])
				}
				if (allCompanies[companyNum]["foundedYear"] != null) {
					const isoDateString = allCompanies[companyNum]["foundedYear"]?.substring(0, 12).replace(/(\d{4})년\s(\d{1,2})월\s(\d{1,2})일/, "$1-$2-$3")
					console.log(isoDateString)
					allCompanies[companyNum]["foundedYear"] = new Date(isoDateString)
				}
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
				console.log(allCompanies[companyNum])
			}
		} catch (err) {
			console.log(err)
		} finally {
			await driver.quit()
			return { companies: allCompanies, jobposts: allJobsArr }
		}
	}


	// 무한 스크롤링
	// let lastHeight = await driver.executeScript(
	//     'return document.body.scrollHeight'
	// )

	// let newHeight
	// while (true) {
	//     await driver.executeScript(
	//         'window.scrollTo(0, document.body.scrollHeight)'
	//     )

	//     await new Promise((resolve) => setTimeout(resolve, 3000))

	//     newHeight = await driver.executeScript(
	//         'return document.body.scrollHeight'
	//     )

	//     console.log(lastHeight)
	//     console.log(newHeight)
	//     if (newHeight == lastHeight) {
	//         break
	//     }
	//     lastHeight = newHeight
	// }

	// const allJobs = await driver.findElements(
	// 	By.css(`div[data-cy="job-card"]`)
	// )

	// const allJobsArr = []
	// for (let i = 0; i < 1; i++) {
	// 	const originalUrl = await allJobs[i]
	// 		.findElement(By.css('a'))
	// 		.getAttribute('href')

	// 	const title = await allJobs[i]
	// 		.findElement(By.className('job-card-position'))
	// 		.getText()
	// 	const companyName = await allJobs[i]
	// 		.findElement(By.className('job-card-company-name'))
	// 		.getText()

	// 	const wantedId = await allJobs[i]
	// 		.findElement(By.css('a'))
	// 		.getAttribute('data-position-id')

	// 	const { data } = await axios.get(
	// 		`https://www.wanted.co.kr/api/v4/jobs/${wantedId}`
	// 	)

	// 	const originalImgUrl = data.job.logo_img.thumb

	// 	const address = data.job.address.full_location
	// 	const [addressUpper, addressLower] = address.split(' ')

	// 	const content = JSON.stringify(data.job.detail)

	// 	// Date으로 번경 필요
	// 	const deadlineDtm =
	// 		data.job.due_time === null ? null : data.due_time

	// 	allJobsArr.push({
	// 		originalSiteNite: '원티드',
	// 		originalUrl: originalUrl,
	// 		originalImgUrl: originalImgUrl,
	// 		title: title,
	// 		content: content,
	// 		salary: null,
	// 		deadlineDtm: deadlineDtm,
	// 		companyName: companyName,
	// 		addressUpper: addressUpper,
	// 		addressLower: addressLower,
	// 	})
	// }

	// console.log(allJobsArr)
	// } catch (error) {
	// 	console.log(error)
	// } finally {
	// 	await driver.quit()
	// 	// await driverBody.quit()
	// }
}
