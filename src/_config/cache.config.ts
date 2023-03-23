import { Injectable } from '@nestjs/common'
import {
    RedisOptionsFactory,
    RedisModuleOptions,
} from '@liaoliaots/nestjs-redis'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class RedisConfigService implements RedisOptionsFactory {
    constructor(private configService: ConfigService) {}

    async createRedisOptions(): Promise<RedisModuleOptions> {
        return {
            config: {
                url: 'redis://jobfit-redis.usn2ar.ng.0001.apn2.cache.amazonaws.com:6379',
            },
        }
    }
}
