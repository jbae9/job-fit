import {
    Controller,
    Get,
    Param,
    Render,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common'
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

    @UseGuards(JwtAuthGuard)
    @Get('/login')
    @Render('index')
    login(@Req() req, @Res() res) {
        // 로그인 되어있는지 판별
        const user = !req.authResult.hasOwnProperty('user')
            ? null
            : req.authResult.user

        if (user) return res.redirect('/')

        return { components: 'login', user: user }
    }

    @UseGuards(JwtAuthGuard)
    @Get('/jobposts')
    @Render('index')
    jobposts(@Req() req, @Res() res) {
        const user = !req.authResult.hasOwnProperty('user')
            ? null
            : req.authResult.user

        if (user) return res.redirect('/')

        return { components: 'jobposts', user: user }
    }
}
