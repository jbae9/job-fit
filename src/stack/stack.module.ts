import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Stack } from 'src/entities/stack.entity'
import { User } from 'src/entities/user.entity'
import { StackController } from './stack.controller'
import { StackService } from './stack.service'

@Module({
    imports: [TypeOrmModule.forFeature([User, Stack])],
    controllers: [StackController],
    providers: [StackService],
})
export class StackModule {}
