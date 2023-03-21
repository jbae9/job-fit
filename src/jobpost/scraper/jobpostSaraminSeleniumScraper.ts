import { Builder, By, until } from 'selenium-webdriver'
import { Options } from 'selenium-webdriver/chrome'
import { PageLoadStrategy } from 'selenium-webdriver/lib/capabilities'
import { SaraminScraper } from './jobpostSaraminAxiosScraper'
import { CompanyRepository } from 'src/company/company.repository'
import { JobpostRepository } from '../jobpost.repository'
const axios = require('axios')
const cheerio = require('cheerio')
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
    allCompanies = [{}]
    allJobsArr = []
    constructor(
        private readonly companyRepository: CompanyRepository,
        private readonly jobpostRepository: JobpostRepository
    ) { }
    async getSaraminScraper(pageCount: string) {
        const options = new Options()
        options.setPageLoadStrategy(PageLoadStrategy.NORMAL)
        options.excludeSwitches('enable-logging')
        let page = 1
        let index = 0

        this.setArr()
        const driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build()
        while (true) {
            console.log(`사람인 ${page}페이지 스크롤 중...`)
            const saraminScraper = new SaraminScraper(
                `https://www.saramin.co.kr/zf_user/jobs/list/job-category?page=` + page + `&cat_mcls=2&isAjaxRequest=0&page_count=` +
                pageCount +
                `&sort=RL&type=job-category&is_param=1&isSearchResultEmpty=1&isSectionHome=0&searchParamCount=1#searchTitle`
            )
            this.allJobsArr = await saraminScraper.getDataAsHtml()
            try {
                for (index = 0; index < this.allJobsArr.length; index++) {
                    await driver.get(`${this.allJobsArr[index].originalUrl}`)
                    await driver.wait(
                        until.elementLocated(By.className('wrap_jv_cont')),
                        15000
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
                    this.allJobsArr[index].salary = Number(salary) * 10000
                    const iframe = await allJobs
                        .findElement(By.css('div.wrap_jv_cont'))
                        .findElement(By.css('div.jv_detail'))
                        .findElement(By.css('div.cont'))
                        .getAttribute('innerHTML')
                    const iframeUrl = iframe.split('"', 21)[17]
                    const iframeData = await axios.get(
                        'https://www.saramin.co.kr' + iframeUrl
                    )
                    const data = cheerio.load(iframeData.data)
                    const jobData = data('.user_content').html()
                    const content = jobData
                    this.allJobsArr[index].content = content
                    const postedDtm = await allJobs
                        .findElement(By.className('info_period'))
                        .findElement(By.css('dd'))
                        .getText()
                    this.allJobsArr[index].postedDtm = new Date(postedDtm)
                    if (this.allJobsArr[index].deadlineDtm.indexOf('채용') != -1) {
                        this.allJobsArr[index].deadlineDtm = null
                    } else if (this.allJobsArr[index].deadlineDtm.indexOf('마감') != -1) {
                        this.allJobsArr[index].deadlineDtm = null
                    } else {
                        let d = new Date(Date.now())
                        this.allJobsArr[index].deadlineDtm = new Date(
                            String(d.getFullYear()) +
                            '/' +
                            String(this.allJobsArr[index].deadlineDtm).substring(2, 7)
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
                            let optionText = await companyOptionList[j]
                                .findElement(By.css('dd'))
                                .getText()
                            for (const key in companyOption) {
                                if (option.indexOf(key) !== -1) {
                                    if (option === '홈페이지' && optionText.substring(0, 4) != 'http') {
                                        optionText = 'http://' + optionText
                                    }
                                    this.allCompanies[index][`${companyOption[key]}`] =
                                        optionText
                                    break
                                }
                            }
                        }
                    } catch (e) {
                        console.log('회사정보 없음')
                    }
                    if (this.allCompanies[index]['numberEmployees'] != null &&
                        typeof (this.allCompanies[index]['numberEmployees']) == 'string') {
                        this.allCompanies[index]['numberEmployees'] = Number(
                            this.allCompanies[index]['numberEmployees']?.split(' ', 1)[0]
                        )
                    }
                    if (this.allCompanies[index]['foundedYear'] != null &&
                        typeof (this.allCompanies[index]['foundedYear']) == 'string') {
                        this.allCompanies[index]['foundedYear'] = Number(
                            this.allCompanies[index]['foundedYear']?.split('년', 1)[0]
                        )
                    }

                    this.allCompanies[index]['companyName'] = this.allJobsArr[index]['companyName']
                    if (index != this.allJobsArr.length - 1) {
                        this.allCompanies.push({
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
                // 오류 날 경우 이전 데이터만 넣고 계속 진행
                if (index === 0) {
                    return
                }
                console.log(err)
                console.log(`에러난 공고: ${this.allJobsArr[index].originalUrl}`)
                this.allCompanies = this.allCompanies.slice(0, index - 1)
                this.allJobsArr = this.allJobsArr.slice(0, index - 1)
            } finally {
                page = await this.insertData(page, this.allCompanies, this.allJobsArr)
                continue
            }
        }
    }

    setArr() {
        this.allCompanies = [
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
        this.allJobsArr = []
    }

    async insertData(page: number, companiesArr: {}[], jobsArr: any[]) {
        page += 1

        // 회사 데이터 넣기
        await this.companyRepository.createCompanies(companiesArr)
        // 채용공고 데이터 넣기
        await this.jobpostRepository.createJobposts(jobsArr)

        console.log(`사람인 ${page}페이지 데이터 생성 완료`)
        this.setArr()

        return page
    }
}
