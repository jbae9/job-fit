import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common'
import { AppService } from './app.service'
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    @Render('index')
    index(@Req() req) {
        // 로그인 되어있는지 판별
        const user = !req.authResult.hasOwnProperty('user')
            ? null
            : req.authResult.user

        console.log(user)

        return { components: 'main', user: user }
    }

    @Get('/login')
    @Render('index')
    login() {
        return { components: 'login' }
    }
}
