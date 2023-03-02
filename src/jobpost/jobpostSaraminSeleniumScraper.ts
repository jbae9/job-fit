import { Builder, By, Key, until, WebDriver } from 'selenium-webdriver'
import { Options } from 'selenium-webdriver/chrome'
import { SaraminScraper } from './jobpost.SaraminAxiosScraper'
require('chromedriver')

const selenium = async () => {
	const options = new Options()
	options.setPageLoadStrategy('normal')
	options.excludeSwitches('enable-logging')

	const driver = await new Builder()
		.forBrowser('chrome')
		.setChromeOptions(options)
		.build()

	const saraminScraper = new SaraminScraper(`https://www.saramin.co.kr/zf_user/jobs/list/job-category?page=1&cat_mcls=2&isAjaxRequest=0&page_count=2&sort=RL&type=job-category&is_param=1&isSearchResultEmpty=1&isSectionHome=0&searchParamCount=1#searchTitle`);
	let jobList = await saraminScraper.getDataAsHtml()

	try {
		for (let i = 0; i < jobList.length; i++) {
			await driver.get(
				`https://www.saramin.co.kr${jobList[i].originalUrl}`)

			const allJobs = await driver.findElement(
				By.css(`.wrap_jview > section:nth-child(1)`)
			)
			const salary = await allJobs
				.findElement(By.className('jv_summary'))
				.findElement(By.css('.cont > .col:nth-child(2) > dl:first-child > dd'))
				.getText()
			jobList[i].salary = salary
			jobList[i].deadlineDtm == '채용' ? null : new Date(String(new Date().getFullYear) + '/' + jobList[i].deadlineDtm)
		}
	} catch (err) {
		console.log(err)
	} finally {
		await driver.quit()
		return jobList
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

selenium()
