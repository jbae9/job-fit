import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/common/cache'
import { InjectRepository } from '@nestjs/typeorm'
import { Cache } from 'cache-manager'
import { User } from 'src/entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    async removeRedisRefreshToken(userId: number): Promise<boolean> {
        return this.cacheManager.del(userId.toString())
    }
}
