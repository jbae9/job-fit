import { PickType } from '@nestjs/mapped-types'
import { User } from 'src/entities/user.entity'

export class GetUserInfoDto extends PickType(User, [
    'userId',
    'email',
    'nickname',
    'profileImage',
    'addressUpper',
    'addressLower',
    'createdDtm',
    'stacks',
    'jobposts',
]) {}
