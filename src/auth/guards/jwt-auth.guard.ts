import { Injectable } from '@nestjs/common'
import { ExecutionContext } from '@nestjs/common/interfaces'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'

import { AuthService } from '../auth.service'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private authService: AuthService,
        private jwtService: JwtService
    ) {
        super()
    }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest()
        const response = context.switchToHttp().getResponse()

        const { accessToken, refreshToken } = request.cookies

        // Access Token 혹은 Refresh Token 이 존재하지 않음
        if (!accessToken || !refreshToken) {
            request.authResult = {
                success: false,
                message: 'Token not found',
            }
            return true
        }

        // Access Token 검증
        const verifyAccessTokenResult =
            await this.authService.verifyAccessToken(accessToken)

        // Access Token expired
        if (verifyAccessTokenResult.message === 'jwt expired') {
            const payload = await this.jwtService.verify(accessToken, {
                ignoreExpiration: true,
            })

            // Get Redis Refresh Token
            const redisRefreshToken = await this.authService.getRefreshToken(
                payload.userId
            )

            // Redis 에 Refresh Token 이 존재하지 않음
            if (!redisRefreshToken) {
                request.authResult = {
                    success: false,
                    message: 'Redis Refresh Token not found',
                }
                return true
            }

            // Redis의 Refresh Token 과 Cookie의 Refresh Token 이 일치하지 않음
            if (redisRefreshToken !== refreshToken) {
                request.authResult = {
                    success: false,
                    message: 'Refresh Token not matched',
                }
                return true
            }

            // Refresh Token 검증
            const verifyRefreshTokenResult =
                await this.authService.verifyRefreshToken(refreshToken)

            //  Refresh Token 만료
            if (verifyRefreshTokenResult.message === 'jwt expired') {
                request.authResult = {
                    success: false,
                    message: 'Refresh Token expired',
                }
                return true
            }

            // 새로운 Access Token 생성
            const newAccessToken = await this.authService.createAccessToken(
                payload.userId
            )

            // 회원 정보 반환
            const user = await this.authService.findUserById(payload.userId)

            // 일치하는 회원이 없으면
            if (!user) {
                request.authResult = {
                    success: false,
                    message: 'User not found',
                }
            }

            request.authResult = {
                success: true,
                user,
            }

            // 새로 발급한 Access Token 쿠키로 보내기
            response.cookie('accessToken', newAccessToken)

            return true
        }

        // Access Token not expired
        const user = await this.authService.findUserById(
            verifyAccessTokenResult.userId
        )

        // 일치하는 회원이 없으면
        if (!user) {
            request.authResult = {
                success: false,
                message: 'User not found',
            }
        }

        request.authResult = {
            success: true,
            user,
        }

        return true
    }
}
