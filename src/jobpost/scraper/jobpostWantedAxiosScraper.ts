import axios from 'axios'
import { getAddress } from '../common/getAddress'

import dotenv from 'dotenv'
dotenv.config({ path: '../../../.env' })

export async function wantedScraper() {
    const startDate = new Date(Date.now())
    console.log('원티드 스크레이핑 시작' + startDate.toTimeString())
    try {
        const { data } = await getAxios(
            'https://www.wanted.co.kr/api/v4/jobs?country=kr&tag_type_ids=518&locations=all&years=-1&limit=100&offset=0&job_sort=job.latest_order'
        )

        const axiosKreditjobIndustryCodes = await axios.get(
            'https://kreditjob.com/api/industries'
        )
        const kreditjobIndustryCodes = axiosKreditjobIndustryCodes.data

        let nextLink = data.links.next
        const allJobsArr = []
        const allCompanyIdsArr = []
        const allCompanies = []
        let jobsList = data.data
        while (nextLink !== null) {
            for (let i = 0; i < jobsList.length; i++) {
                if (jobsList[i].status === 'active') {
                    const originalUrl = `https://www.wanted.co.kr/wd/${jobsList[i].id}`
                    const title = jobsList[i].position

                    const axiosJobDetails = await getAxios(
                        `https://www.wanted.co.kr/api/v4/jobs/${jobsList[i].id}`
                    )

                    const jobDetails = axiosJobDetails.data

                    const originalImgUrl = jobDetails.job.logo_img.thumb

                    const address = jobDetails.job.address
                    let originalAddress: string | null
                    let addressUpper: string | null
                    let addressLower: string | null
                    let longitude: number | null
                    let latitude: number | null
                    let addressDetail: {
                        lat?: number
                        lng?: number
                        address?: string
                    }
                    let addressName: string
                    let getAddressResult

                    if (address) {
                        if (address.geo_location) {
                            addressDetail = address.geo_location.n_location
                            addressName = addressDetail.address
                            getAddressResult = await getAddress(
                                addressName,
                                process.env.KAKAO_KEY
                            )
                        } else {
                            getAddressResult = await getAddress(
                                address.full_location,
                                process.env.KAKAO_KEY
                            )
                        }

                        originalAddress = address.full_location
                        addressUpper = getAddressResult.addressUpper
                        addressLower = getAddressResult.addressLower
                        longitude = getAddressResult.longitude
                        latitude = getAddressResult.latitude
                    } else {
                        originalAddress = null
                        addressUpper = null
                        addressLower = null
                        longitude = null
                        latitude = null
                    }

                    const content = JSON.stringify(jobDetails.job.detail)

                    // Date으로 번경 필요
                    let deadlineDtm =
                        jobsList[i].due_time === null
                            ? null
                            : jobsList[i].due_time
                    if (deadlineDtm !== null)
                        deadlineDtm = new Date(`${deadlineDtm} 23:59:59.999`)

                    const companyId = jobsList[i].company.id
                    let companyName = jobsList[i].company.name
                    if (companyName.includes('(주)')) {
                        companyName = companyName.split('(주)').join('')
                    }

                    // 회사 정보가 이미 저장되어있는지 확인
                    if (!allCompanyIdsArr.includes(companyId)) {
                        allCompanyIdsArr.push(companyId)

                        // 원티드 회사 정보 API
                        const axiosCompanyDetails = await getAxios(
                            `https://www.wanted.co.kr/api/v4/companies/${companyId}`
                        )

                        const companyDetails = axiosCompanyDetails.data

                        const companyImgUrl =
                            companyDetails.company.logo_img.thumb
                        let companyHomepageUrl =
                            companyDetails.company.detail.link
                        if (!companyHomepageUrl.startsWith('http')) {
                            companyHomepageUrl = 'http://' + companyHomepageUrl
                        }

                        // Kreditjob 회사 연봉 정보
                        const companyKreditjobId =
                            companyDetails.company.kreditjob_id

                        try {
                            const axiosKreditjobCompanyEmploymentDetails =
                                await axios.get(
                                    `https://kreditjob.com/api/company/${companyKreditjobId}/summary`
                                )

                            const kreditjobCompanyEmploymentDetails =
                                axiosKreditjobCompanyEmploymentDetails.data

                            const numberEmployees =
                                kreditjobCompanyEmploymentDetails.employee.total
                            const avgSalary =
                                kreditjobCompanyEmploymentDetails.salary.salary

                            // Kreditjob 회사 정보
                            const axiosKreditjobCompanyDetails =
                                await axios.get(
                                    `https://kreditjob.com/api/company/${companyKreditjobId}/info`
                                )

                            const kreditjobCompanyDetails =
                                axiosKreditjobCompanyDetails.data
                            const companyAddress =
                                kreditjobCompanyDetails.location
                            const companyIndustryCode =
                                kreditjobCompanyDetails.industryCode
                            const { name: industryType } =
                                kreditjobIndustryCodes.find((code) => {
                                    if (code.code === companyIndustryCode)
                                        return code.name
                                })
                            const foundedYear =
                                kreditjobCompanyDetails.foundedYear

                            allCompanies.push({
                                companyName: companyName,
                                representativeName: null,
                                numberEmployees: numberEmployees,
                                address: companyAddress,
                                foundedYear: foundedYear,
                                imageUrl: companyImgUrl,
                                homepageUrl: companyHomepageUrl,
                                annualSales: 0,
                                avgSalary: avgSalary,
                                kreditjobUrl: `https://kreditjob.com/company/${companyKreditjobId}`,
                                industryType: industryType,
                            })
                        } catch (error) {
                            const industryType =
                                companyDetails.company.industry_name

                            allCompanies.push({
                                companyName: companyName,
                                representativeName: null,
                                numberEmployees: null,
                                address: null,
                                foundedYear: null,
                                imageUrl: companyImgUrl,
                                homepageUrl: companyHomepageUrl,
                                annualSales: null,
                                avgSalary: null,
                                kreditjobUrl: null,
                                industryType: industryType,
                            })
                        }
                    }
                    allJobsArr.push({
                        title: title,
                        content: content,
                        salary: null,
                        originalSiteName: '원티드',
                        originalUrl: originalUrl,
                        originalImgUrl: originalImgUrl,
                        postedDtm: null,
                        deadlineDtm: deadlineDtm,
                        originalAddress,
                        addressUpper: addressUpper,
                        addressLower: addressLower,
                        longitude,
                        latitude,
                        companyName: companyName,
                    })
                }
            }
            const nextPage = await getAxios(
                `https://www.wanted.co.kr${nextLink}`
            )

            nextLink = nextPage.data.links.next
            // nextLink = null

            jobsList = nextPage.data.data
        }

        const endDate = new Date(Date.now())
        console.log('원티드 스크레이핑 완료' + endDate.toTimeString())

        return { companies: allCompanies, jobposts: allJobsArr }
    } catch (error) {
        console.log(error)
    }
}

async function getAxios(url: string) {
    const userAgentsList = [
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Safari/605.1.15',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.53 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Windows; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.1.2 Safari/603.3.8',
        'Mozilla/5.0 (Windows NT 10.0; Windows; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.53 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15',
        'Mozilla/5.0 (Windows NT 10.0; Windows; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.53 Safari/537.36',
    ]
    const axiosHeaders = {
        'User-Agent':
            userAgentsList[Math.floor(Math.random() * userAgentsList.length)],
    }

    if (url.includes('undefined')) {
        throw new Error('undefined')
    }

    let waitTime = 10000
    let tries = 1
    while (tries <= 100) {
        try {
            const axiosData = await axios.get(url, {
                headers: axiosHeaders,
            })
            if (axiosData.status === 404) {
                throw Error('404')
            }
            return axiosData
        } catch (error) {
            if (error.message === '404') {
                throw Error('404')
            }
            console.log(url)
            await new Promise((resolve) => setTimeout(resolve, waitTime))
            waitTime += 5000
            tries++
        }
    }
}
