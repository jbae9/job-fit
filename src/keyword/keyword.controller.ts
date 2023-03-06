import { Controller, Post } from '@nestjs/common'
import { KeywordService } from './keyword.service'
import { default as keywords } from '../resources/data/database/keywords.json'
import { default as stacks } from '../resources/data/database/stacks.json'

@Controller('api/')
export class KeywordController {
    constructor(private readonly keywordService: KeywordService) {}

    private keywords = keywords
    private stacks = stacks

    @Post('/keywords')
    async postKeywords() {
        await this.keywordService.postKeywords(this.keywords)
    }

    @Post('/stacks')
    async postStacks() {
        await this.keywordService.postStacks(this.stacks)
    }
}
