import { Builder, By, until } from 'selenium-webdriver'
import { Options } from 'selenium-webdriver/chrome'
import { PageLoadStrategy } from 'selenium-webdriver/lib/capabilities'
import { SaraminScraper } from './jobpostSaraminAxiosScraper'
require('chromedriver')
const companyOption = {
    기업형태: 'corporateType',
    사원수: 'numberEmployees',
    설립일: 'foundedYear',
    매출액: 'annualSales',
    대표자명: 'representativeName',
    홈페이지: 'homepageUrl',
    기업주소: 'address',
}

export class SaraminSelenium {
    pageCount: string
    constructor(count: string) {
        this.pageCount = count
    }
    async getSaraminScraper() {
        const options = new Options()
        options.setPageLoadStrategy(PageLoadStrategy.NORMAL)
        options.excludeSwitches('enable-logging')

        const driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build()
        const saraminScraper = new SaraminScraper(
            `https://www.saramin.co.kr/zf_user/jobs/list/job-category?page=1&cat_mcls=2&isAjaxRequest=0&page_count=` +
            this.pageCount +
            `&sort=RL&type=job-category&is_param=1&isSearchResultEmpty=1&isSectionHome=0&searchParamCount=1#searchTitle`
        )
        let allJobsArr = await saraminScraper.getDataAsHtml()

        let allCompanies = [
            {
                companyName: null,
                representativeName: null,
                numberEmployees: null,
                address: null,
                foundedYear: null,
                imageUrl: null,
                homepageUrl: null,
                annualSales: null,
                avgSalary: null,
                kreditjobUrl: null,
                corporateType: null,
            },
        ]
        try {
            for (let i = 0; i < allJobsArr.length; i++) {
                await driver.get(
                    `https://www.saramin.co.kr${allJobsArr[i].originalUrl}`
                )
                await driver.wait(
                    until.elementLocated(By.className('wrap_jv_cont')),
                    3000
                )
                const allJobs = await driver
                    .findElement(By.className(`wrap_jview`))
                    .findElement(By.css('section:first-child'))
                let salary = '0'
                let salaryText = await allJobs
                    .findElement(By.className('jv_summary'))
                    .findElement(
                        By.css(
                            '.cont > .col:nth-child(2) > dl:first-child > dt'
                        )
                    )
                    .getText()
                if (salaryText === '급여') {
                    salary = await allJobs
                        .findElement(By.className('jv_summary'))
                        .findElement(
                            By.css(
                                '.cont > .col:nth-child(2) > dl:first-child > dd'
                            )
                        )
                        .getText()
                    if (
                        salary === '면접 후 결정' ||
                        salary === '회사내규에 따름'
                    ) {
                        salary = '0'
                    } else {
                        salary = salary.split(' ', 2)[1].replace(',', '')
                    }
                }
                const content = await allJobs
                    .findElement(By.css('div.wrap_jv_cont'))
                    .findElement(By.css('div.jv_detail'))
                    .findElement(By.css('div.cont'))
                    .getAttribute('innerHTML')

                allJobsArr[i].content = content
                const postedDtm = await allJobs
                    .findElement(By.className('info_period'))
                    .findElement(By.css('dd'))
                    .getText()
                allJobsArr[i].postedDtm = new Date(postedDtm)
                allJobsArr[i].salary = Number(salary) * 10000
                if (allJobsArr[i].deadlineDtm.indexOf('채용') != -1) {
                    allJobsArr[i].deadlineDtm = null
                } else if (allJobsArr[i].deadlineDtm.indexOf('마감') != -1) {
                    allJobsArr[i].deadlineDtm = null
                } else {
                    let d = new Date(Date.now())
                    allJobsArr[i].deadlineDtm = new Date(
                        String(d.getFullYear()) +
                        '/' +
                        String(allJobsArr[i].deadlineDtm).substring(2, 7)
                    )
                }
                try {
                    const companyOptionList = await allJobs
                        .findElement(By.className('wrap_info'))
                        .findElements(By.css('.info > dl'))
                    for (let j = 0; j < companyOptionList.length; j++) {
                        const option = await companyOptionList[j]
                            .findElement(By.css('dt'))
                            .getText()
                        const optionText = await companyOptionList[j]
                            .findElement(By.css('dd'))
                            .getText()
                        for (const key in companyOption) {
                            if (option.indexOf(key) !== -1) {
                                allCompanies[i][`${companyOption[key]}`] =
                                    optionText
                                break
                            }
                        }
                    }
                } catch (e) {
                    console.log('회사정보 없음')
                }
                if (allCompanies[i]['numberEmployees'] != null) {
                    allCompanies[i]['numberEmployees'] = Number(
                        allCompanies[i]['numberEmployees'].split(' ', 1)[0]
                    )
                }
                if (allCompanies[i]['foundedYear'] != null) {
                    allCompanies[i]['foundedYear'] = Number(
                        allCompanies[i]['foundedYear']?.split('년', 1)[0]
                    )
                }

                allCompanies[i]['companyName'] = allJobsArr[i]['companyName']
                if (i != allJobsArr.length - 1) {
                    allCompanies.push({
                        companyName: null,
                        representativeName: null,
                        numberEmployees: null,
                        address: null,
                        foundedYear: null,
                        imageUrl: null,
                        homepageUrl: null,
                        annualSales: null,
                        avgSalary: null,
                        kreditjobUrl: null,
                        corporateType: null,
                    })
                }
            }
        } catch (err) {
            console.log(err)
        } finally {
            await driver.quit()
            return { companies: allCompanies, jobposts: allJobsArr }
        }
    }
}
