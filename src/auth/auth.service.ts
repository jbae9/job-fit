import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/common/cache'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Cache } from 'cache-manager'
import { User } from 'src/entities/user.entity'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) {}

    async findUser(email: string): Promise<User | null> {
        const user = await this.userRepository.findOne({
            where: { email },
        })

        if (!user) return null

        return user
    }

    async findUserById(userId: number): Promise<User | null> {
        const user = await this.userRepository.findOne({
            where: { userId },
        })

        if (!user) return null

        return user
    }

    async createUser(userProfile: CreateUserDto) {
        return await this.userRepository.save(userProfile)
    }

    async createAccessToken(userId: number) {
        const payload = { userId }

        return this.jwtService.signAsync(payload, {
            expiresIn: '10s',
        })
    }

    async createRefreshToken() {
        return this.jwtService.signAsync(
            {},
            {
                expiresIn: '7d',
            }
        )
    }

    async saveRefreshToken(userId: number, token: string) {
        await this.cacheManager.set(userId.toString(), token, { ttl: 604800 })
    }

    async getRefreshToken(userId: number): Promise<string> {
        return await this.cacheManager.get(userId.toString())
    }

    async verifyAccessToken(accessToken: string) {
        try {
            const payload = await this.jwtService.verify(accessToken)

            return { success: true, userId: payload.userId }
        } catch (error) {
            return {
                success: false,
                message: error.message,
            }
        }
    }

    async verifyRefreshToken(refreshToken: string) {
        try {
            await this.jwtService.verify(refreshToken)

            return { success: true }
        } catch (error) {
            return {
                success: false,
                message: error.message,
            }
        }
    }
}
