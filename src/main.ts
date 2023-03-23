import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { AppModule } from './app.module'
import cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common'

declare const module: any

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule)

    app.useGlobalPipes(new ValidationPipe({ transform: true }))
    app.use(cookieParser())

    // ejs 세팅
    app.useStaticAssets(join(__dirname, '..', 'src', 'public'))
    app.setBaseViewsDir(join(__dirname, '..', 'src', 'views'))
    app.setViewEngine('ejs')

    await app.listen(process.env.PORT)

    if (module.hot) {
        module.hot.accept()
        module.hot.dispose(() => app.close())
    }
}
bootstrap()
