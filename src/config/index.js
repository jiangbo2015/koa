export default {
	secret: "koa-app",
	jwtWhiteList: [
		/^\/public/,
		/\/user\/add/,
		/\/user\/register/,
		/\/order\/detail/,
		/\/common\/upload/,
		/\/system\/detail/
	],
	rate: "https://api.exchangeratesapi.io/latest?base=USD"
}
