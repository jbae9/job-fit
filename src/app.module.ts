import {
    CacheModule,
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserController } from './user/user.controller'
import { UserModule } from './user/user.module'
import { JobPostController } from './job-post/job-post.controller'
import { JobPostModule } from './job-post/job-post.module'
import { ConfigModule, ConfigService } from '@nestjs/config/dist'
import { JwtModule } from '@nestjs/jwt'
import { ThrottlerModule } from '@nestjs/throttler'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtConfigService } from './_config/jwt.config.service'
import { TypeOrmConfigService } from './_config/typeorm.config.service'
import { CompanyModule } from './company/company.module'

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            useClass: TypeOrmConfigService,
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useClass: JwtConfigService,
            inject: [ConfigService],
        }),
        // CacheModule.register({
        //     ttl: 60000, // 데이터 캐싱 시간(밀리 초 단위, 1000 = 1초)
        //     max: 100, // 최대 캐싱 개수
        //     isGlobal: true,
        // }),
        // ThrottlerModule.forRoot({
        //     ttl: 60,
        //     limit: 10, // ttl (60초) 동안 limit 만큼의 요청만 받는다.
        // }),
        UserModule,
        JobPostModule,
        CompanyModule,
    ],
    controllers: [AppController, UserController, JobPostController],
    providers: [AppService],
})
export class AppModule {}
