import Koa from "koa"
import koaBody from "koa-body"
import jwt from "koa-jwt"
import cors from "@koa/cors"
import koaStatic from "koa-static"
import logger from "koa-logger"
import path from "path"

import router from "./routers"
import config from "./config"
import { response } from "./utils"

// 数据库连接
import "./utils/db"

const app = new Koa()

// 日志
app.use(logger())

// 允许跨域处理
app.use(
	cors({
		origin: function(ctx) {
			// return "*"
			return ctx.request.header.origin
		},
		maxAge: 5,
		credentials: false,
		allowMethods: ["GET", "POST"],
		allowHeaders: [
			"Content-Type",
			"Authorization",
			"Accept",
			"X-Requested-With"
		]
	})
)

// 静态资源文件
app.use(
	koaStatic(path.join(__dirname, "public"), {
		maxage: 3600 * 24 * 7 * 1000
	})
)

// koa-body处理post请求和文件上传
app.use(
	koaBody({
		multipart: true,
		formidable: {
			maxFileSize: 200 * 1024 * 1024
		}
	})
)

// 自定义拦截，校验token
app.use(async (ctx, next) => {
	try {
		await next()
	} catch (err) {
		if (err.status === 401) {
			ctx.status = 401
			ctx.body = response(false, null, "invalid token")
		} else {
			throw err
		}
	}
})

// 使用jwt验证，其后面的路由访问将受限
app.use(
	jwt({ secret: config.secret }).unless({
		path: config.jwtWhiteList
	})
)

// 使用restful api
app.use(router.routes()).use(router.allowedMethods())

app.listen(process.env.PORT || 3000)
