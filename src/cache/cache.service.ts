import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class CacheService {
	private readonly redisClient: Redis;
	constructor(private readonly redisService: RedisService) {
		this.redisClient = redisService.getClient();
	}

	async getLikedjobpost(jobpostId: number) {
		return await this.redisClient.hmget('likedjobposts', `jobpostId`, 'userId')
	}


	async setLikedjobpost(jobpostId: number, userId: number) {
		await this.redisClient.hmset('likedjobposts',
			'jobpostId', jobpostId.toString(),
			'userId', userId.toString())
	}

	async delLikedjobpost(jobpostId: number, userId: number) {
		await this.redisClient.hdel('likedjobposts', 'jobpostId', jobpostId.toString(), 'userId', userId.toString())
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
}