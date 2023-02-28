import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/entities/user.entity'
import { JwtConfigService } from 'src/_config/jwt.config.service'
import { AuthService } from './auth.service'
import { KakaoStrategy } from './kakao.straregy'

@Module({
    imports: [
        PassportModule.register({
            session: false,
        }),
        TypeOrmModule.forFeature([User]), // 이건 TypeORM 강의 시간에 배웠죠?
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useClass: JwtConfigService,
            inject: [ConfigService],
        }),
    ],
    providers: [AuthService, KakaoStrategy],
})
export class AuthModule {}
