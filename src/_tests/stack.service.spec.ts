import { Test, TestingModule } from '@nestjs/testing'
import { StackService } from '../stack/stack.service'

describe('StackService', () => {
    let service: StackService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [StackService],
        }).compile()

        service = module.get<StackService>(StackService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
