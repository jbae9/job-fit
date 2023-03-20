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
import { StackService } from 'src/stack/stack.service'
import { Jobpost } from 'src/entities/jobpost.entity'

@Module({
    imports: [
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([User, Stack, Jobpost]),
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
    providers: [UserService, StackService],
    exports: [UserService],
    controllers: [UserController],
})
export class UserModule {}
