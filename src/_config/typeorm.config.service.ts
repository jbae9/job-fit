import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config/dist'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { User } from 'src/entities/user.entity'
import { Jobpost } from 'src/entities/jobpost.entity'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { Company } from 'src/entities/company.entity'
import { Keyword } from 'src/entities/keyword.entity'
import { Stack } from 'src/entities/stack.entity'

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
            entities: [User, Jobpost, Company, Keyword, Stack],
            synchronize:
                this.configService.get<string>('DATABASE_SYNCHRONIZE') ==
                'true',
            namingStrategy: new SnakeNamingStrategy(),
            timezone: '+09:00',
            // logging: 'all',
            // logger: 'advanced-console',
        }
    }
}
