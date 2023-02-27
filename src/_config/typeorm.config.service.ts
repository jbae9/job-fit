import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config/dist'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { User } from 'src/user/user.entity'
import { JobPost } from 'src/job-post/job-post.entity'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { Company } from 'src/company/company.entity'

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    // Constructor DI
    constructor(private readonly configService: ConfigService) {}
    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            host: this.configService.get<string>('DATABASE_HOST'),
            port: this.configService.get<number>('DATABASE_PORT'),
            username: this.configService.get<string>('DATABASE_USERNAME'),
            password: this.configService.get<string>('DATABASE_PASSWORD'),
            database: this.configService.get<string>('DATABASE_NAME'),
            entities: [User, JobPost, Company],
            synchronize: this.configService.get<boolean>(
                'DATABASE_SYNCHRONIZE'
            ),
            namingStrategy: new SnakeNamingStrategy(),
        }
    }
}
