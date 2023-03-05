import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Keyword } from 'src/entities/keyword.entity';
import { Stack } from 'src/entities/stack.entity';
import { Repository } from 'typeorm';

@Injectable()
export class KeywordService {
    constructor(
        @InjectRepository(Keyword) private keywordRepository: Repository<Keyword>,
        @InjectRepository(Stack) private stackRepository: Repository<Stack>,
        private logger: Logger
    ) {}

    async postKeywords(keywords: {keyword: string, keywordCode: number}[]) {
        this.logger.log(keywords)
        await this.keywordRepository.save(keywords)
    }

    async postStacks(stacks: {stack: string, category: string}[]) {
        await this.stackRepository.save(stacks)
    }
}
