import axios from 'axios'
import dotenv from 'dotenv'
import { getAddress } from '../common/getAddress'
import { JobpostRepository } from '../jobpost.repository'
import { CompanyRepository } from 'src/company/company.repository'

dotenv.config({ path: '../../../.env' })

export class ProgrammersScraper {
    constructor(
        private companyRepository: CompanyRepository,
        private jobpostRepository: JobpostRepository
    ) {}

    async programmersScraper() {
        const startDate = new Date(Date.now())
        console.log('프로그래머스 스크레이핑 시작' + startDate.toTimeString())

        // 회사정보 객체 배열
        let companies = []
        // 채용공고 객체 배열
        let jobposts = []
        try {
            const { data } = await axios.get(
                'https://career.programmers.co.kr/api/job_positions'
            )

            // 총 페이지 수
            const totalPages: number = data.totalPages

            for (let i = 1; i <= totalPages; i++) {
                const { data } = await axios.get(
                    `https://career.programmers.co.kr/api/job_positions?page=${i}`
                )

                // 한 페이지 채용공고 객체 배열
                const jobPositions = data.jobPositions

                // 한 페이지 채용공고들을 하나 씩 돌면서 데이터 객체 만들어서 배열에 넣기
                for (let i = 0; i < jobPositions.length; i++) {
                    // 채용공고 데이터 객체구조분해할당
                    const {
                        id,
                        title,
                        minSalary,
                        company,
                        startAt,
                        period,
                        address,
                    } = jobPositions[i]

                    try {
                        // 채용공고 상세페이지 URL
                        const originalUrl = `https://career.programmers.co.kr/job_positions/${id}`

                        // 채용공고 상세페이지 API URL
                        const apiUrl = `https://career.programmers.co.kr/api/job_positions/${id}`

                        // 채용공고 상세페이지 접근
                        const jobPostDetail = await axios.get(apiUrl)

                        // 채용공고 상세페이지 데이터 객체구조분해할당
                        const {
                            additionalInformation,
                            description,
                            preferredExerience,
                            requirement,
                        } = jobPostDetail.data.jobPosition

                        // 채용공고 상세 내용
                        const content =
                            description +
                            requirement +
                            preferredExerience +
                            additionalInformation

                        // 채용공고 이미지 URL
                        const originalImgUrl = company.logoUrl

                        // 채용공고 게시일
                        const postedDtm = startAt

                        // 채용공고 마감일 '상시 채용'은 null
                        const deadlineDtm =
                            period === '상시 채용'
                                ? null
                                : new Date(
                                      period
                                          .split('부터 ')[1]
                                          .replace('까지', '')
                                  )

                        // 채용공고 주소
                        const {
                            addressUpper,
                            addressLower,
                            longitude,
                            latitude,
                        } = await getAddress(address, process.env.KAKAO_KEY)

                        // 연봉
                        // minSalary 가 null 이면 null, 아니라면 100,000,000 미만이면 10,000을 곱하고 아니라면 그대로
                        const salary = !minSalary
                            ? null
                            : minSalary < 100000000
                            ? minSalary * 10000
                            : minSalary

                        // 회사 이름
                        const companyName = company.name.replace('(주)', '')

                        // 채용공고 객체 데이터
                        const jobpostData = {
                            title,
                            content,
                            salary,
                            originalSiteName: '프로그래머스',
                            originalUrl,
                            originalImgUrl,
                            postedDtm,
                            deadlineDtm,
                            originalAddress: address,
                            addressUpper,
                            addressLower,
                            longitude,
                            latitude,
                            companyName,
                        }

                        // 회사 객체 데이터
                        const companyData = {
                            companyName,
                            representativeName: null,
                            numberEmployees: company.employeesCount,
                            address: company.address,
                            foundedYear: null,
                            imageUrl: company.logoUrl,
                            homepageUrl: company.homeUrl,
                            annualSales: null,
                            avgSalary: null,
                            kreditjobUrl: null,
                            corporateType: null,
                        }

                        // 채용공고 배열에 push
                        jobposts.push(jobpostData)
                        // 회사 배열에 push
                        companies.push(companyData)
                    } catch (error) {
                        continue
                    }
                }
                // 회사 데이터 중복 제거
                const companiesSetArray = companies.filter(
                    (arr, index, callback) =>
                        index ===
                        callback.findIndex(
                            (v) => v.companyName === arr.companyName
                        )
                )

                // 회사 데이터 넣기
                await this.companyRepository.createCompanies(jobposts)

                // 채용공고 데이터 넣기
                await this.jobpostRepository.createJobposts(companiesSetArray)

                jobposts = []
                companies = []
            }

            const endDate = new Date(Date.now())
            console.log('프로그래머스 스크레이핑 완료' + endDate.toTimeString())

            return
        } catch (error) {
            await this.companyRepository.createCompanies(jobposts)
            await this.jobpostRepository.createJobposts(companies)

            return
        }
    }
}
