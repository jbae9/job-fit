import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/entities/user.entity'
import { JwtConfigService } from 'src/_config/jwt.config.service'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategy/jwt.strategy'
import { KakaoStrategy } from './strategy/kakao.strategy'
import redisStore from 'cache-manager-redis-store'
import { RedisModule } from '@liaoliaots/nestjs-redis'
import { CacheService } from 'src/cache/cache.service'

@Module({
    imports: [
        PassportModule.register({
            session: false,
        }),
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useClass: JwtConfigService,
            inject: [ConfigService],
        }),
        RedisModule,
    ],
    providers: [AuthService, KakaoStrategy, JwtStrategy, CacheService],
    exports: [PassportModule, JwtModule, AuthService],
})
export class AuthModule {}
