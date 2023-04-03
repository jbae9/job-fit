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
                url: this.configService.get('REDIS_URL'),
                password: this.configService.get('REDIS_PASSWORD'),
                // host: this.configService.get('REDIS_HOST'),
                // port: Number(this.configService.get('REDIS_PORT')),
                // username: this.configService.get('REDIS_USERNAME'),
            },
        }
    }
}
