import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-kakao'
import { AuthService } from './auth.service'
import { CreateUserDto } from './dto/create-user.dto'

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            clientID: process.env.KAKAO_KEY,
            callbackURL: process.env.KAKAO_CALLBACK,
        })
    }
    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: any
    ): Promise<any> {
        const email = profile._json.kakao_account.email
        const nickname = profile._json.properties.nickname
        const profileImage = profile._json.properties.profile_image

        const userProfile: CreateUserDto = {
            email,
            nickname,
            profileImage,
            role: 'user',
            addressUpper: null,
            addressLower: null,
        }

        // DB에 회원이 존재하는지 검사
        const user = await this.authService.findUser(email)

        // 회원이 없을 때 회원가입 진행
        if (user === null) {
            const createUserResult = await this.authService.createUser(
                userProfile
            )

            // 회원 고유 id로 access token, refresh token 생성
            const userAccessToken = await this.authService.createAccessToken(
                createUserResult
            )
            const userRefreshToken = await this.authService.createRefreshToken()

            return { userAccessToken, userRefreshToken }
        }

        // 회원 고유 id로 access token, refresh token 생성
        const userAccessToken = await this.authService.createAccessToken(user)
        const userRefreshToken = await this.authService.createRefreshToken()

        return { userAccessToken, userRefreshToken }
    }
}
