import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class CacheService {
	private readonly redisClient: Redis;
	constructor(private readonly redisService: RedisService) {
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
		return await this.redisClient.bitcount(jobpostId.toString())
	}

	async setViewCount(jobpostId: number, userId: number) {
		let pipe = this.redisClient.pipeline()
		pipe.setbit(jobpostId.toString(), userId, 1).expire(jobpostId.toString(), 60)
		pipe.exec()
	}
}