import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request, Response, NextFunction } from 'express'

export interface UserRequest extends Request {
    user: string
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private jwtService: JwtService) {}

    async use(req: UserRequest, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization

        if (!authHeader) {
            throw new UnauthorizedException('JWT not found')
        }

        let token: string
        try {
            token = authHeader.split(' ')[1]
            const payload = await this.jwtService.verify(token)
            req.user = payload
            next()
        } catch (err) {
            throw new UnauthorizedException(`Invalid JWT: ${token}`)
        }
    }
}
