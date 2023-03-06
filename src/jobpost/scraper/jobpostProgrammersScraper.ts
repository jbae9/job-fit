import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config({ path: '../../../.env' })

export async function programmersScraper() {
    // 회사정보 객체 배열
    const companies = []
    // 채용공고 객체 배열
    const jobposts = []
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
                const { id, title, minSalary, company, period, address } =
                    jobPositions[i]

                try {
                    // 채용공고 상세페이지 URL
                    const originalUrl = `https://career.programmers.co.kr/api/job_positions/${id}`

                    // 채용공고 상세페이지 접근
                    const jobPostDetail = await axios.get(originalUrl)

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

                    // 채용공고 마감일 '상시 채용'은 null
                    const deadlineDtm =
                        period === '상시 채용'
                            ? null
                            : new Date(
                                  period.split('부터 ')[1].replace('까지', '')
                              )

                    // 채용공고 주소
                    const { addressUpper, addressLower } = await getAddress(
                        address,
                        process.env.KAKAO_KEY
                    )
                    // console.log(addressUpper, addressLower)

                    // 회사 이름
                    const companyName = company.name

                    // 채용공고 객체 데이터
                    const jobpostData = {
                        title,
                        content,
                        salary: minSalary,
                        originalSiteName: '프로그래머스',
                        originalUrl,
                        originalImgUrl,
                        deadlineDtm,
                        addressUpper,
                        addressLower,
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
        }

        // 회사 데이터 중복 제거
        const companiesSetArray = companies.filter(
            (arr, index, callback) =>
                index ===
                callback.findIndex((v) => v.companyName === arr.companyName)
        )

        return { jobposts, companiesSetArray }
    } catch (error) {
        console.log(error)
    } finally {
        return { jobposts, companies }
    }
}

async function getAddress(address: string, key: string) {
    // 카카오 주소 API

    // 재택
    if (address === '재택') return { addressUpper: null, addressLower: null }

    const addressData = await axios.get(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${
            address.split(',')[0]
        }&analyze_type=similar`,
        {
            headers: {
                Authorization: `KakaoAK ${key}`,
            },
        }
    )

    //잘못된 주소로 인해서 주소가 나오지 않을 때
    if (addressData.data.documents.length === 0)
        return { addressUpper: null, addressLower: null }

    const addressName = addressData.data.documents[0].address.address_name
    const upper = addressName.split(' ')[0]
    const lower = addressName.split(' ')[1]

    // '서울', '부산', '대구', '인천', '광주', '대전', '울산'
    if (
        ['서울', '부산', '대구', '인천', '광주', '대전', '울산'].includes(upper)
    ) {
        return {
            addressUpper: upper + '시',
            addressLower: lower,
        }
    }

    // '세종'
    if (upper.includes('세종')) {
        return {
            addressUpper: '세종시',
            addressLower: '전체',
        }
    }

    // '도'
    if (
        [
            '경기',
            '강원',
            '충북',
            '충남',
            '전북',
            '전남',
            '경북',
            '경남',
        ].includes(upper)
    ) {
        switch (upper) {
            case '충북':
                return { addressUpper: '충청북도', addressLower: lower }
            case '충남':
                return { addressUpper: '충청북도', addressLower: lower }
            case '전북':
                return { addressUpper: '충청북도', addressLower: lower }
            case '전남':
                return { addressUpper: '충청북도', addressLower: lower }
            case '경북':
                return { addressUpper: '충청북도', addressLower: lower }
            case '경남':
                return { addressUpper: '충청북도', addressLower: lower }
            default:
                return { addressUpper: upper + '도', addressLower: lower }
        }
    }

    // '제주'
    if (upper.includes('제주')) {
        return {
            addressUpper: '제주특별자치도',
            addressLower: lower,
        }
    }
}
