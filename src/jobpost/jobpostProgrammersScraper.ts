import axios from 'axios'

export async function programmersScraper() {
    try {
        const { data } = await axios.get(
            'https://career.programmers.co.kr/api/job_positions'
        )

        // 총 페이지 수
        const totalPages: number = data.totalPages

        // 회사번호 배열
        const companyIds = []
        // 채용공고 객체 배열
        const jobPosts = []

        for (let i = 1; i <= 1; i++) {
            const { data } = await axios.get(
                `https://career.programmers.co.kr/api/job_positions?page=${i}`
            )

            // 한 페이지 채용공고 객체 배열
            const jobPositions = data.jobPositions

            // 한 페이지 채용공고들을 하나 씩 돌면서 데이터 객체 만들어서 배열에 넣기
            for (let i = 0; i < 20; i++) {
                // 채용공고 데이터 객체구조분해할당
                const { id, title, minSalary, company, period, address } =
                    jobPositions[i]

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
                        : new Date(period.split('부터 ')[1].replace('까지', ''))

                // 채용공고 주소
                const addressUpper = null
                const addressLower = null

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
                // 채용공고 배열에 push
                jobPosts.push(jobpostData)

                // 크레딧잡 회사정보
                const KreditjobCompanyDetail = await axios.get(``)

                // 회사 대표자명
                const representativeName = null
            }
        }
    } catch (error) {}
}

programmersScraper()
