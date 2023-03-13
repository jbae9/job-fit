import { CacheModule, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { JobpostModule } from './jobpost/jobpost.module'
import { ConfigModule, ConfigService } from '@nestjs/config/dist'
import { JwtModule } from '@nestjs/jwt'
import { ThrottlerModule } from '@nestjs/throttler'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtConfigService } from './_config/jwt.config.service'
import { TypeOrmConfigService } from './_config/typeorm.config.service'
import { CompanyModule } from './company/company.module'
import { AuthModule } from './auth/auth.module'
import { KeywordModule } from './keyword/keyword.module'
import redisStore from 'cache-manager-redis-store'
import { ScheduleModule } from '@nestjs/schedule'
import { StackModule } from './stack/stack.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useClass: TypeOrmConfigService,
            inject: [ConfigService],
        }),
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
        // ThrottlerModule.forRoot({
        //     ttl: 60,
        //     limit: 10, // ttl (60초) 동안 limit 만큼의 요청만 받는다.
        // }),
        UserModule,
        JobpostModule,
        CompanyModule,
        AuthModule,
        KeywordModule,
        ScheduleModule.forRoot(),
        StackModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
