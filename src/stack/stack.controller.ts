import { Body, Controller, Get, Post } from '@nestjs/common'
import { StackService } from './stack.service'

@Controller('api/stack')
export class StackController {
    constructor(private readonly stackService: StackService) {}

    @Get()
    async getStacks() {
        return await this.stackService.getStacks()
    }
}
