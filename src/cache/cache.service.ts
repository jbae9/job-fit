import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { JobpostRepository } from '../jobpost/jobpost.repository'

@Injectable()
export class CacheService {
	private readonly redisClient: Redis
	private readonly jobpostRepository: JobpostRepository
	constructor(
		private readonly redisService: RedisService
	) {
		this.redisClient = redisService.getClient();
	}

	async getLikedjobpost(jobpostId: number, userId: number) {
		return await this.redisClient.srem('likedjobposts', jobpostId.toString() + ',' + userId.toString())
	}

	async setLikedjobpost(jobpostId: number, userId: number) {
		await this.redisClient.sadd('likedjobposts',
			jobpostId.toString() + ',' + userId.toString())
	}

	async getAllLikedjobpost() {
		return await this.redisClient.smembers('likedjobposts')
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
		if (!userId) { //비회원 조회
			userId = 0
		}
		let count = await this.redisClient.getbit(jobpostId.toString(), userId)
		if (count != 1) {
			pipe.setbit(jobpostId.toString(), userId, 1).expire(jobpostId.toString(), 5)
			pipe.exec()
			await this.addCountOne(jobpostId)
		}
	}

	async addCountOne(jobpostId: number) {
		if (!jobpostId) {
			return
		}
		let count = Number(await this.redisClient.hget('views', jobpostId.toString()))
		if (count > 0) {
			count += 1
			await this.redisClient.hset('views', jobpostId.toString(), count)
		} else {
			await this.redisClient.hset('views', jobpostId.toString(), 1)
		}
	}

}