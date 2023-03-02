import { Test, TestingModule } from '@nestjs/testing'
import { JobpostService } from '../jobpost/jobpost.service'

describe('JobpostService', () => {
    let service: JobpostService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [JobpostService],
        }).compile()

        service = module.get<JobpostService>(JobpostService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
