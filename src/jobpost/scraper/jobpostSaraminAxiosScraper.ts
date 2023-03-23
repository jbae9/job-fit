import { getAddress } from '../common/getAddress'
import dotenv from 'dotenv'

const axios = require('axios')
const cheerio = require('cheerio')

dotenv.config({ path: '../../../.env' })

export class SaraminScraper {
    url: string
    exit: number | 0
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

        for (let jobpost of jobData) {
            const title = await data(jobpost).find('.job_tit a span').text()
            const url = data(jobpost).find('.job_tit a').attr('href')
            const deadlineDtm = data(jobpost).find('.deadlines').text()
            let companyName = data(jobpost).find('.company_nm a span').text()
            let address = data(jobpost).find('.work_place').text()

            // title이 없을 때 마지막 페이지에 도달함
            if (!title) {
                this.exit = 1
                break
            }

            let addressUpper: string | null
            let addressLower: string | null
            let longitude: number | null
            let latitude: number | null
            if (companyName.indexOf('(주)') != -1) {
                companyName = companyName.replace('(주)', '')
            }

            if (address.includes('전체')) {
                const addressSlice = address.split('전체')[0]
                const getAddressResult = await getAddress(
                    addressSlice,
                    process.env.KAKAO_KEY
                )
                addressUpper = getAddressResult.addressUpper
                addressLower = '전체'
                longitude = getAddressResult.longitude
                latitude = getAddressResult.latitude
            } else {
                const getAddressResult = await getAddress(
                    address,
                    process.env.KAKAO_KEY
                )
                addressUpper = getAddressResult.addressUpper
                addressLower = getAddressResult.addressLower
                longitude = getAddressResult.longitude
                latitude = getAddressResult.latitude
            }

            allJobsArr.push({
                companyName: companyName,
                title: title,
                content: '',
                salary: 0,
                originalSiteName: '사람인',
                originalUrl: 'https://www.saramin.co.kr' + url,
                originalImageUrl: 'image',
                deadlineDtm: deadlineDtm,
                originalAddress: address,
                addressUpper: addressUpper,
                addressLower: addressLower,
                longitude,
                latitude,
            })
        }

        return allJobsArr
    }
}
