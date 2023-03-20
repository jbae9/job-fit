import {
    HttpException,
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/common/cache'
import { InjectRepository } from '@nestjs/typeorm'
import { Cache } from 'cache-manager'
import { Jobpost } from 'src/entities/jobpost.entity'
import { Stack } from 'src/entities/stack.entity'
import { User } from 'src/entities/user.entity'
import { getAddress } from 'src/jobpost/common/getAddress'
import { userStackDto } from 'src/stack/dto/create-userstack.dto'
import { StackService } from 'src/stack/stack.service'
import { Repository } from 'typeorm'
import { GetUserInfoDto } from './dto/get-userInfo.dto'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Stack) private stackRepository: Repository<Stack>,
        @InjectRepository(Jobpost)
        private jobpostRepository: Repository<Jobpost>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly stackService: StackService
    ) {}

    async removeRedisRefreshToken(userId: number): Promise<boolean> {
        return this.cacheManager.del(userId.toString())
    }

    async getMyInfo(userId: number): Promise<GetUserInfoDto> {
        try {
            return await this.userRepository.findOne({
                select: [
                    'userId',
                    'email',
                    'nickname',
                    'profileImage',
                    'addressUpper',
                    'addressLower',
                    'createdDtm',
                ],
                where: { userId },
                relations: ['stacks', 'jobposts'],
            })
        } catch (error) {
            throw error
        }
    }

    async updateUserAddress(userId: number, address: string) {
        const { addressUpper, addressLower, longitude, latitude } =
            await getAddress(address, process.env.KAKAO_KEY)

        const updateResult = await this.userRepository.update(
            { userId },
            { addressUpper, addressLower, longitude, latitude }
        )

        if (!updateResult.affected)
            throw new InternalServerErrorException(
                '주소 수정을 실패하였습니다.'
            )

        return { message: '주소를 수정하였습니다.' }
    }

    async createUserStack(userId: number, stackId: number) {
        try {
            await this.userRepository
                .createQueryBuilder()
                .relation(User, 'stacks')
                .of(userId)
                .add(stackId)
        } catch (error) {
            return { message: '등록에 실패했습니다. 관리자에게 문의하십시오.' }
        }
    }

    async deleteUserStack(userId: number, stackId: number) {
        try {
            let user = await this.userRepository.findOne({
                where: { userId },
                relations: ['stacks'],
            })

            user.stacks = user.stacks.filter((r) => r.stackId !== stackId)

            await this.userRepository.save(user)
        } catch (error) {
            return { message: '삭제에 실패했습니다. 관리자에게 문의하십시오.' }
        }
    }

    async getLikedJobposts(userId: number) {
        try {
            return await this.userRepository
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.jobposts', 'jobpost')
                .leftJoinAndSelect('jobpost.company', 'company')
                .leftJoinAndSelect('jobpost.keywords', 'keyword')
                .where('user.user_id = :userId', { userId })
                .getOne()
        } catch (error) {
            console.log(error)
            return {
                message:
                    '찜 목록을 가져오는데 실패했습니다. 관리자에게 문의하십시오.',
            }
        }
    }

    // 추천 알고리즘 적용해서 들고오기
    async getRecommendJobpost(userId: number) {
        // 모든 기술스택 가져오기
        const allStacks = await this.stackService.getStacks()
        const allStacksArray = allStacks.map(({ stack }) => stack)

        // 유저의 선호 기술스택, 좌표 정보 들고오기
        const userData = await this.getUserStacksWithPosition(userId)
        // 유저 스택
        const userStacks = userData.stacks.map(({ stack }) => stack)
        // 유저 좌표
        const userPosition = {
            longitude: userData.longitude,
            latitude: userData.latitude,
        }

        // 채용공고 데이터 가져오기
        const jobpostData = await this.getJobpostStacksWithPosition()

        const jobposts = jobpostData.reduce((acc, item) => {
            const existItem = acc.find(
                (accItem) => accItem.jobpostId === item.jobpostId
            )

            if (existItem) {
                existItem.stack.push(item.stack)
            } else {
                if (!item.stack) {
                    acc.push({ ...item, stack: [] })
                } else {
                    acc.push({ ...item, stack: [item.stack] })
                }
            }

            return acc
        }, [])

        // 유저 선호 기술스택 벡터
        const userStacksVector = await this.createStacksVector(
            userStacks,
            allStacksArray
        )

        // 코사인유사도 알고리즘 적용 후 채용공고 별로 점수 누적
        let distanceArr = []
        const jobpostRecommendScore = await Promise.all(
            jobposts.map(async (jobpost) => {
                // 채용공고 1개의 기술스택 벡터
                const jobpostStacksVector = await this.createStacksVector(
                    jobpost.stack,
                    allStacksArray
                )

                // 채용공고 1개의 기술스 택과 유저의 기술스택의 유사도 점수
                const stackSimilarityScore = await this.cosineSimilarity(
                    userStacksVector,
                    jobpostStacksVector
                )

                // Haversine 공식으로 거리측정
                const distanceFromUser = await this.Haversine(
                    userPosition.longitude,
                    userPosition.latitude,
                    jobpost.longitude,
                    jobpost.latitude
                )

                distanceArr.push(distanceFromUser)

                return {
                    jobpostId: jobpost.jobpostId,
                    stackSimilarityScore,
                    distanceFromUser,
                }
            })
        )

        // 최대 거리, 최소거리
        const maxDistance = Math.max.apply(
            Math,
            distanceArr.filter((distance) => !Number.isNaN(distance))
        )
        const minDistance = Math.min.apply(
            Math,
            distanceArr.filter((distance) => !Number.isNaN(distance))
        )

        const recommendScore = jobpostRecommendScore.map((jobpost) => {
            // 거리 가중치
            const distanceWeight = Number.isNaN(jobpost.distanceFromUser)
                ? 0
                : 1 -
                  (jobpost.distanceFromUser - minDistance) /
                      (maxDistance - minDistance)

            // 총 점수 계산
            // 스택 유사도에 0.5 , 거리 점수에 0.3
            const score =
                0.5 * jobpost.stackSimilarityScore + 0.3 * distanceWeight

            return {
                jobpostId: jobpost.jobpostId,
                score,
            }
        })

        // 점수 순으로 정렬
        recommendScore.sort((a, b) => b.score - a.score)

        console.log(recommendScore)

        // return jobpostRecommendScore
    }

    // 채용공고 기술스택, 좌표 정보 들고오기
    async getJobpostStacksWithPosition() {
        const jobpostData = await this.jobpostRepository
            .createQueryBuilder('jobpost')
            .select('stack.stack', 'stack')
            .addSelect('jobpost.jobpostId', 'jobpostId')
            .addSelect('jobpost.longitude', 'longitude')
            .addSelect('jobpost.latitude', 'latitude')
            .leftJoin('jobpost.stacks', 'stack')
            .getRawMany()

        return jobpostData
    }

    // 유저의 선호 기술스택, 좌표 정보 들고오기
    async getUserStacksWithPosition(userId: number) {
        const userData = await this.userRepository
            .createQueryBuilder('user')
            .select('user.longitude')
            .addSelect('user.latitude')
            .addSelect('stacks', 'stacks')
            .leftJoin('user.stacks', 'stacks')
            .where('user.user_id = :userId', { userId })
            .getOne()

        return userData
    }

    // 기술스택 벡터
    async createStacksVector(stacks, allStacks) {
        return allStacks.map((stack) => {
            return stacks.includes(stack) ? 1 : 0
        })
    }

    // 코사인유사도 알고리즘
    async cosineSimilarity(vectorA, vectorB) {
        let dotProduct = 0
        let magnitudeA = 0
        let magnitudeB = 0

        for (let i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i]
            magnitudeA += vectorA[i] * vectorA[i]
            magnitudeB += vectorB[i] * vectorB[i]
        }

        magnitudeA = Math.sqrt(magnitudeA)
        magnitudeB = Math.sqrt(magnitudeB)

        if (magnitudeA === 0 || magnitudeB === 0) {
            return 0
        }

        return dotProduct / (magnitudeA * magnitudeB)
    }

    // Haversine 거리측정 공식
    async Haversine(userLng, userLat, jobpostLng, jobpostLat) {
        // Longitude: 경도 X, Latitude: 위도 Y
        const R = 6371 // 지구 반지름 (단위 Km)
        const toRadian = Math.PI / 180

        const deltaLat = Math.abs(jobpostLat - userLat) * toRadian
        const deltaLon = Math.abs(jobpostLng - userLng) * toRadian

        const sinDeltaLat = Math.sin(deltaLat / 2)
        const sinDeltaLon = Math.sin(deltaLon / 2)

        const squareRoot = Math.sqrt(
            sinDeltaLat * sinDeltaLon +
                Math.cos(userLng * toRadian) *
                    Math.cos(jobpostLng * toRadian) *
                    sinDeltaLon *
                    sinDeltaLon
        )

        return 2 * R * Math.asin(squareRoot)
    }
}
