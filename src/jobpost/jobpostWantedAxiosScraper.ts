import axios from 'axios'
import fs from 'fs'
import { CompanyRepository } from 'src/company/company.repository'

export async function wantedScraper() {
    const startDate = new Date(Date.now())
    console.log(startDate.toTimeString())
    try {
        const { data } = await axios.get(
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
        const jobsList = data.data
        while (nextLink !== null) {
            for (let i = 0; i < jobsList.length; i++) {
                if (jobsList[i].status === 'active') {
                    const originalUrl = `https://www.wanted.co.kr/wd/${jobsList[i].id}`
                    const title = jobsList[i].position

                    const axiosJobDetails = await axios.get(
                        `https://www.wanted.co.kr/api/v4/jobs/${jobsList[i].id}`
                    )
                    const jobDetails = axiosJobDetails.data

                    const originalImgUrl = jobDetails.job.logo_img.thumb

                    const address = jobDetails.job.address.full_location
                    const [addressUpper, addressLower] = address.split(' ')

                    const content = JSON.stringify(jobDetails.job.detail)

                    // Date으로 번경 필요
                    let deadlineDtm =
                        jobsList[i].due_time === null
                            ? null
                            : jobsList[i].due_time
                    if (deadlineDtm !== null)
                        deadlineDtm = new Date(deadlineDtm)

                    const companyId = jobsList[i].company.id
                    const companyName = jobsList[i].company.name

                    // 회사 정보가 이미 저장되어있는지 확인
                    if (!allCompanyIdsArr.includes(companyId)) {
                        allCompanyIdsArr.push(companyId)

                        // 원티드 회사 정보 API
                        const axiosCompanyDetails = await axios.get(
                            `https://www.wanted.co.kr/api/v4/companies/${companyId}`
                        )
                        const companyDetails = axiosCompanyDetails.data

                        const companyImgUrl =
                            companyDetails.company.logo_img.thumb
                        const companyHomepageUrl =
                            companyDetails.company.detail.link

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
                        addressUpper: addressUpper,
                        addressLower: addressLower,
                        companyName: companyName,
                    })
                }
            }
            const nextPage = await axios.get(
                `https://www.wanted.co.kr${nextLink}`
            )
            nextLink = nextPage.data.links.next
            // nextLink = null
        }

        // fs.writeFile(
        //     'jobposts.txt',
        //     JSON.stringify(allJobsArr),
        //     function (err) {
        //         console.log(err)
        //     }
        // )

        // fs.writeFile(
        //     'companies.txt',
        //     JSON.stringify(allCompanies),
        //     function (err) {
        //         console.log(err)
        //     }
        // )

        const endDate = new Date(Date.now())
        console.log(endDate.toTimeString())

        return { companies: allCompanies, jobposts: allJobsArr }
    } catch (error) {
        console.log(error)
    }
}
