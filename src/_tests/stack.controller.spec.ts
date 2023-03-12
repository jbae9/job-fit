import { Test, TestingModule } from '@nestjs/testing'
import { StackController } from '../stack/stack.controller'

describe('StackController', () => {
    let controller: StackController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [StackController],
        }).compile()

        controller = module.get<StackController>(StackController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
