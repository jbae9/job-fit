import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtConfigService } from 'src/_config/jwt.config.service'
import { UserController } from './user.controller'
import { User } from '../entities/user.entity'
import { UserService } from './user.service'
import redisStore from 'cache-manager-redis-store'
import { forwardRef } from '@nestjs/common/utils'
import { AuthModule } from 'src/auth/auth.module'
import { Stack } from 'src/entities/stack.entity'
import { RedisModule } from '@liaoliaots/nestjs-redis'
import { CacheService } from 'src/cache/cache.service'

@Module({
    imports: [
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([User, Stack]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useClass: JwtConfigService,
            inject: [ConfigService],
        }),
        RedisModule,
    ],
    providers: [UserService, CacheService],
    exports: [UserService],
    controllers: [UserController],
})
export class UserModule {}
