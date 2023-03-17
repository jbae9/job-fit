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
		// return await this.redisClient.hget('views', jobpostId.toString())
		// return await this.redisClient.hlen('view,' + jobpostId.toString())
		// return await this.redisClient.smembers('viewjobposts')
	}

	async setViewCount(jobpostId: number, userId: number) {
		// let pipe = this.redisClient.pipeline()
		// let count = await this.redisClient.getbit(jobpostId.toString(), userId)
		// console.log('bitmap: ' + count)
		// if (count != 1) {
		// 	pipe.setbit(jobpostId.toString(), userId, 1).expire(jobpostId.toString(), 5)
		// 	pipe.exec()
		// 	await this.addCountOne(jobpostId)
		// }
		// pipe.hset('viewjobpost',
		// 	jobpostId.toString(), 'jobpostId',
		// 	userId.toString(), 'userId')
	}

	async addCountOne(jobpostId: number) {
		let count = Number(await this.redisClient.hget('views', jobpostId.toString()))
		if (count > 0) {
			count += 1
			await this.redisClient.hset('views', jobpostId.toString(), count)
		} else {
			await this.redisClient.hset('views', jobpostId.toString(), 1)
		}
	}

}