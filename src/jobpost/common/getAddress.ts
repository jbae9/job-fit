import axios from 'axios'

export async function getAddress(address: string, key: string) {
    let addressUpper: string | null = null
    let addressLower: string | null = null
    // 경도 x
    let longitude: number | null = null
    // 위도 y
    let latitude: number | null = null
    let addressName: string | null
    try {
        // 재택
        if (address === '재택')
            return { addressUpper, addressLower, longitude, latitude }

        // 카카오 주소검색 API
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
            return { addressUpper, addressLower, longitude, latitude }

        // 주소가 잘 나올때
        const addressDetail = addressData.data.documents[0]

        if (addressDetail.address === null) {
            addressName = addressDetail.address_name
        } else {
            addressName = addressDetail.address.address_name
        }

        const upper = addressName.split(' ')[0]
        let lower = addressName.split(' ')[1]

        // lower 가 undefined 거나 빈 문자열일때
        if (!lower || lower === '') lower = null

        longitude = addressDetail.x
        latitude = addressDetail.y

        // '서울', '부산', '대구', '인천', '광주', '대전', '울산'
        if (
            ['서울', '부산', '대구', '인천', '광주', '대전', '울산'].includes(
                upper
            )
        ) {
            addressUpper = upper + '시'
            addressLower = lower
        }

        // '세종'
        if (upper.includes('세종')) {
            addressUpper = '세종시'
            addressLower = '전체'
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
                    addressUpper = '충청북도'
                    addressLower = lower
                    break
                case '충남':
                    addressUpper = '충청남도'
                    addressLower = lower
                    break
                case '전북':
                    addressUpper = '전라북도'
                    addressLower = lower
                    break
                case '전남':
                    addressUpper = '전라남도'
                    addressLower = lower
                    break
                case '경북':
                    addressUpper = '경상북도'
                    addressLower = lower
                    break
                case '경남':
                    addressUpper = '경상남도'
                    addressLower = lower
                    break
                default:
                    addressUpper = upper + '도'
                    addressLower = lower
                    break
            }
        }

        // '제주'
        if (upper.includes('제주')) {
            addressUpper = '제주특별자치도'
            addressLower = lower
        }

        return { addressUpper, addressLower, longitude, latitude }
    } catch (error) {
        return { addressUpper, addressLower, longitude, latitude }
    }
}
