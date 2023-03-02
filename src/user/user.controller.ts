import { Controller } from '@nestjs/common'
import { Get, Req, Res, UseGuards } from '@nestjs/common/decorators'
import { KakaoAuthGuard } from 'src/auth/guards/kakao-auth.guard'
import { UserService } from './user.service'

@Controller('user')
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
}
