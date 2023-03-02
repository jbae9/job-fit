import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/entities/user.entity'
import { JwtConfigService } from 'src/_config/jwt.config.service'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategy/jwt.strategy'
import { KakaoStrategy } from './strategy/kakao.straregy'
import redisStore from 'cache-manager-redis-store'

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
        CacheModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                isGlobal: true,
                store: redisStore,
                host: configService.get('REDIS_HOST'),
                port: Number(configService.get('REDIS_PORT')),
                password: configService.get('REDIS_PASSWORD'),
            }),
        }),
    ],
    providers: [AuthService, KakaoStrategy, JwtStrategy],
    exports: [PassportModule, JwtModule, AuthService],
})
export class AuthModule {}
