import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt'

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    createJwtOptions(): JwtModuleOptions {
        return {
            secret: this.configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: '3600s' }, // 토큰의 만료시간은 1시간
        }
    }
}
