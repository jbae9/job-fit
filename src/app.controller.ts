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
import { CacheService } from 'src/cache/cache.service'
import { Cron } from '@nestjs/schedule'

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly cacheService: CacheService
    ) {}

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

        if (user)
            return res.render('alert.ejs', {
                message: '이미 로그인 중입니다.',
                href: '/',
            })

        return { components: 'login', user: user }
    }

    @UseGuards(JwtAuthGuard)
    @Get('/jobposts')
    @Render('index')
    jobposts(@Req() req, @Res() res) {
        const user = !req.authResult.hasOwnProperty('user')
            ? null
            : req.authResult.user

        return { components: 'jobposts', user: user }
    }

    // 마이페이지 - 기본은 내 정보 카테고리
    @UseGuards(JwtAuthGuard)
    @Get('/mypage')
    @Render('index')
    mypage(@Req() req, @Res() res) {
        const user = !req.authResult.hasOwnProperty('user')
            ? null
            : req.authResult.user

        if (!user)
            return res.render('alert.ejs', {
                message: '로그인이 필요합니다.',
                href: '/',
            })

        return { components: 'mypage', user: user, subComponents: 'myinfo' }
    }

    // 마이페이지 내 정보 카테고리
    @UseGuards(JwtAuthGuard)
    @Get('/mypage/myinfo')
    @Render('index')
    mypageMyinfo(@Req() req, @Res() res) {
        const user = !req.authResult.hasOwnProperty('user')
            ? null
            : req.authResult.user

        if (!user)
            return res.render('alert.ejs', {
                message: '로그인이 필요합니다.',
                href: '/',
            })

        return { components: 'mypage', user: user, subComponents: 'myinfo' }
    }

    // 마이페이지 내 찜목록 카테고리
    @UseGuards(JwtAuthGuard)
    @Get('/mypage/likes')
    @Render('index')
    mypageMyposts(@Req() req, @Res() res) {
        const user = !req.authResult.hasOwnProperty('user')
            ? null
            : req.authResult.user

        if (!user)
            return res.render('alert.ejs', {
                message: '로그인이 필요합니다.',
                href: '/',
            })

        return { components: 'mypage', user: user, subComponents: 'mylikes' }
    }

    // 채용공고 상세페이지
    @UseGuards(JwtAuthGuard)
    @Get('/jobpost/:jobpostId')
    @Render('index')
    async jobpostDetail(@Req() req, @Param('jobpostId') jobpostId: number) {
        const user = !req.authResult.hasOwnProperty('user')
            ? null
            : req.authResult.user

        this.cacheService.setViewCount(jobpostId, user?.userId)
        const view = await this.cacheService.getViewCount(jobpostId)
        console.log('조회수:' + view)

        return { components: 'detail', user: user, jobpostId }
    }
}
