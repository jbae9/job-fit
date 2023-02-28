import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtConfigService } from 'src/_config/jwt.config.service'
import { UserController } from './user.controller'
import { User } from '../entities/user.entity'
import { UserService } from './user.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([User]), // 이건 TypeORM 강의 시간에 배웠죠?
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useClass: JwtConfigService,
            inject: [ConfigService],
        }),
    ],
    providers: [UserService],
    exports: [UserService],
    controllers: [UserController],
})
export class UserModule {}
