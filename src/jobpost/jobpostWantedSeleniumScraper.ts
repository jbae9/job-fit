import { Builder, By, Key, until, WebDriver } from 'selenium-webdriver'
import { Options } from 'selenium-webdriver/chrome'
import axios from 'axios'

const selenium = async () => {
	const options = new Options()
	options.setPageLoadStrategy('normal')
	options.excludeSwitches('enable-logging')

	const driver = await new Builder()
		.forBrowser('chrome')
		.setChromeOptions(options)
		.build()

	try {
		await driver.get(
			'https://www.wanted.co.kr/wdlist/518?country=kr&job_sort=job.latest_order&years=-1&locations=all'
		)

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

		const allJobs = await driver.findElements(
			By.css(`div[data-cy="job-card"]`)
		)

		const allJobsArr = []
		for (let i = 0; i < 1; i++) {
			const originalUrl = await allJobs[i]
				.findElement(By.css('a'))
				.getAttribute('href')

			const title = await allJobs[i]
				.findElement(By.className('job-card-position'))
				.getText()
			const companyName = await allJobs[i]
				.findElement(By.className('job-card-company-name'))
				.getText()

			const wantedId = await allJobs[i]
				.findElement(By.css('a'))
				.getAttribute('data-position-id')

			const { data } = await axios.get(
				`https://www.wanted.co.kr/api/v4/jobs/${wantedId}`
			)

			const originalImgUrl = data.job.logo_img.thumb

			const address = data.job.address.full_location
			const [addressUpper, addressLower] = address.split(' ')

			const content = JSON.stringify(data.job.detail)

			let deadlineDtm = data.job.due_time === null ? null : data.due_time
			if (deadlineDtm !== null) deadlineDtm = new Date(deadlineDtm)

			allJobsArr.push({
				originalSiteName: '원티드',
				originalUrl: originalUrl,
				originalImgUrl: originalImgUrl,
				title: title,
				content: content,
				salary: null,
				deadlineDtm: deadlineDtm,
				companyName: companyName,
				addressUpper: addressUpper,
				addressLower: addressLower,
			})
		}

		console.log(allJobsArr)
	} catch (error) {
		console.log(error)
	} finally {
		await driver.quit()
	}
}

selenium()