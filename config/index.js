export default {
	secret: "koa-app",
	jwtWhiteList: [/^\/public/, /\/user\/login/, /\/user\/register/]
}
