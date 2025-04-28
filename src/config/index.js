export default {
	secret: "koa-app",
	jwtWhiteList: [
		/^\/public/,
		/\/user\/login/,
		/\/user\/add/,
		/\/user\/register/,
		/\/user\/feedback/,
		/\/order\/detail/,
		/\/common\/upload/,
		/\/system\/detail/,
	],
	rate: "https://api.exchangeratesapi.io/latest?base=USD",
}
