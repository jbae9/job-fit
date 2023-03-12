import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Stack } from 'src/entities/stack.entity'
import { User } from 'src/entities/user.entity'
import { Repository } from 'typeorm'
import { userStackDto } from './dto/create-userstack.dto'

@Injectable()
export class StackService {
    constructor(
        @InjectRepository(Stack) private stackRepository: Repository<Stack>
    ) {}

    async getStacks(): Promise<Stack[] | null> {
        return await this.stackRepository.find({})
    }
}
