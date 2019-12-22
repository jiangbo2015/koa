export default {
	secret: "koa-app",
	jwtWhiteList: [
		/^\/public/,
		/\/user\/login/,
		/\/user\/register/,
		/\/user\/getList/,
		/\/common\/upload/
	],
	rate: "https://api.exchangeratesapi.io/latest?base=USD"
}
