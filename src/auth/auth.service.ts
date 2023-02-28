import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/entities/user.entity'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService
    ) {}

    async findUser(email: string): Promise<User | null> {
        const user = await this.userRepository.findOne({
            where: { email },
        })

        if (!user) return null

        return user
    }

    async createUser(userProfile: CreateUserDto) {
        return await this.userRepository.save(userProfile)
    }

    async createAccessToken(user: User) {
        const payload = { userId: user.userId }

        return this.jwtService.signAsync(payload, {
            expiresIn: '10m',
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
}
