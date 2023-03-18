import { Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'
import { RedisService } from '@liaoliaots/nestjs-redis'
import { JobpostRepository } from '../jobpost/jobpost.repository'

@Injectable()
export class CacheService {
    private readonly redisClient: Redis
    private readonly jobpostRepository: JobpostRepository
    constructor(private readonly redisService: RedisService) {
        this.redisClient = redisService.getClient()
    }

    // redis 에 찜 누른 채용공고와 유저를 등록
    async setLikedjobpost(jobpostId: number, userId: number) {
        await this.redisClient.sadd('likedJobposts', `(${jobpostId},${userId})`)
    }

    // DB에 반영되고 난 후 찜 데이터 제거
    async remLikedjobpost() {
        await this.redisClient.del('likedJobposts')
    }

    // redis 에 저장되어있는 찜 눌린 채용공고 리스트
    async getAllLikedjobpost() {
        return await this.redisClient.smembers('likedJobposts')
    }

    // redis 에 찜 누른 요소 하나가  저장되어 있는지 체크
    async isLikedjobpost(jobpostId: number, userId: number) {
        return await this.redisClient.sismember(
            'likedJobposts',
            `(${jobpostId},${userId})`
        )
    }

    // redis 에 찜 눌린 저장되어있는 요소 하나 제거
    async remOneLikedjobpost(jobpostId: number, userId: number) {
        await this.redisClient.srem('likedJobposts', `(${jobpostId},${userId})`)
    }

    async saveRefreshToken(userId: number, token: string) {
        await this.redisClient.set(userId.toString(), token)
    }

    async getRefreshToken(userId: number): Promise<string> {
        return await this.redisClient.get(userId.toString())
    }

    async removeRedisRefreshToken(userId: number) {
        return this.redisClient.del(userId.toString())
    }

    async getViewCount(jobpostId: number) {
        return await this.redisClient.hget('views', jobpostId.toString())
    }

    async setViewCount(jobpostId: number, userId: number) {
        let pipe = this.redisClient.pipeline()
        if (!userId) {
            //비회원 조회
            userId = 0
        }
        let count = await this.redisClient.getbit(jobpostId.toString(), userId)
        if (count != 1) {
            pipe.setbit(jobpostId.toString(), userId, 1).expire(
                jobpostId.toString(),
                5
            )
            pipe.exec()
            await this.addCountOne(jobpostId)
        }
    }

    async addCountOne(jobpostId: number) {
        let count = Number(
            await this.redisClient.hget('views', jobpostId.toString())
        )
        if (count > 0) {
            count += 1
            await this.redisClient.hset('views', jobpostId.toString(), count)
        } else {
            await this.redisClient.hset('views', jobpostId.toString(), 1)
        }
    }
}
