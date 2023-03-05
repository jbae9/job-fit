const axios = require('axios')
const cheerio = require('cheerio')

export class SaraminScraper {
    url: string
    constructor(url: string) {
        this.url = url
    }
    async getHtml(url: string) {
        try {
            return await axios.get(url)
        } catch (error) {
            console.log(error)
        }
    }

    async getDataAsHtml() {
        let html = await this.getHtml(this.url)
        let allJobsArr = []
        const data = cheerio.load(html.data)
        const jobData = data('.list_body').children('div')

        jobData.each(async function (i: number, elem: any) {
            const title = data(elem).find('.job_tit a span').text()
            const url = data(elem).find('.job_tit a').attr('href')
            const deadlineDtm = data(elem).find('.deadlines').text()
            let address = data(elem).find('.work_place').text()
            let addressUpper = ''
            let addressLower = ''
            if (address.indexOf('전체') == -1) {
                addressUpper = address.split(' ', 2)[0]
                addressLower = address.split(' ', 2)[1]
            } else {
                addressUpper = address
            }

            allJobsArr.push({
                title: title,
                content: '',
                salary: 0,
                originalSiteName: '사람인',
                originalUrl: url,
                originalImageUrl: 'image',
                deadlineDtm: deadlineDtm,
                addressUpper: addressUpper,
                addressLower: addressLower,
            })
        })
        return allJobsArr
    }
}
