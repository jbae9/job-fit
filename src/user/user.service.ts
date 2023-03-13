import {
    HttpException,
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/common/cache'
import { InjectRepository } from '@nestjs/typeorm'
import { Cache } from 'cache-manager'
import { Stack } from 'src/entities/stack.entity'
import { User } from 'src/entities/user.entity'
import { getAddress } from 'src/jobpost/common/getAddress'
import { userStackDto } from 'src/stack/dto/create-userstack.dto'
import { Repository } from 'typeorm'
import { GetUserInfoDto } from './dto/get-userInfo.dto'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Stack) private stackRepository: Repository<Stack>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    async removeRedisRefreshToken(userId: number): Promise<boolean> {
        return this.cacheManager.del(userId.toString())
    }

    async getMyInfo(userId: number): Promise<GetUserInfoDto> {
        try {
            return await this.userRepository.findOne({
                select: [
                    'userId',
                    'email',
                    'nickname',
                    'profileImage',
                    'addressUpper',
                    'addressLower',
                    'createdDtm',
                ],
                where: { userId },
                relations: ['stacks', 'jobposts'],
            })
        } catch (error) {
            throw error
        }
    }

    async updateUserAddress(userId: number, address: string) {
        const { addressUpper, addressLower, longitude, latitude } =
            await getAddress(address, process.env.KAKAO_KEY)

        const updateResult = await this.userRepository.update(
            { userId },
            { addressUpper, addressLower, longitude, latitude }
        )

        if (!updateResult.affected)
            throw new InternalServerErrorException(
                '주소 수정을 실패하였습니다.'
            )

        return { message: '주소를 수정하였습니다.' }
    }

    async createUserStack(userId: number, stackId: number) {
        try {
            await this.userRepository
                .createQueryBuilder()
                .relation(User, 'stacks')
                .of(userId)
                .add(stackId)
        } catch (error) {
            return { message: '등록에 실패했습니다. 관리자에게 문의하십시오.' }
        }
    }

    async deleteUserStack(userId: number, stackId: number) {
        try {
            let user = await this.userRepository.findOne({
                where: { userId },
                relations: ['stacks'],
            })

            user.stacks = user.stacks.filter((r) => r.stackId !== stackId)

            await this.userRepository.save(user)
        } catch (error) {
            return { message: '삭제에 실패했습니다. 관리자에게 문의하십시오.' }
        }
    }
}
