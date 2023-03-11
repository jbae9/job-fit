import { Controller } from '@nestjs/common'
import {
    Body,
    Get,
    Param,
    Post,
    Put,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common/decorators'
import { HttpException, UnauthorizedException } from '@nestjs/common/exceptions'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { KakaoAuthGuard } from 'src/auth/guards/kakao-auth.guard'
import { UserService } from './user.service'

@Controller('api/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(KakaoAuthGuard)
    @Get('/auth/kakao')
    async kakaoLogin() {}

    @UseGuards(KakaoAuthGuard)
    @Get('/auth/kakao/callback')
    async kakaoCallback(@Req() req, @Res() res) {
        const { userAccessToken, userRefreshToken } = req.user

        res.cookie('accessToken', userAccessToken)
        res.cookie('refreshToken', userRefreshToken)

        return res.redirect('/')
    }

    @UseGuards(JwtAuthGuard)
    @Post('/logout')
    async logOut(@Req() req, @Res() res) {
        // 로그인 되어있는 상태에서 들어온 요청인지 아닌지 판단
        const user = !req.authResult.hasOwnProperty('user')
            ? null
            : req.authResult.user

        // 로그인이 되어있지 않다면?
        if (!user) throw new UnauthorizedException('로그인 상태가 아닙니다.')

        // Redis의 refresh token 삭제
        const result = await this.userService.removeRedisRefreshToken(
            user.userId
        )

        if (result) {
            // cookie의 access token, refresh token 삭제
            res.clearCookie('accessToken')
            res.clearCookie('refreshToken')
            return res.json({ message: '성공적으로 로그아웃되었습니다.' })
        } else {
            throw new HttpException(
                '로그아웃에 실패하였습니다. 관리자에게 문의하십시오.',
                400
            )
        }
    }

    @Get('/myinfo/:userId')
    async getMyInfo(@Param('userId') userId: number) {
        return await this.userService.getMyInfo(userId)
    }

    @Put('/myinfo/:userId/address')
    async updateMyAddress(
        @Param('userId') userId: number,
        @Body('address') address: string
    ) {
        console.log(address)
        return await this.userService.updateMyAddress(userId, address)
    }
}
