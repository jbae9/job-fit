import { IsNumber } from 'class-validator'

export class userStackDto {
    @IsNumber()
    userId: number
    @IsNumber()
    stackId: number
}
