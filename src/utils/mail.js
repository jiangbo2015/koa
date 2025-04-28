var nodemailer = require("nodemailer")

var transporter = nodemailer.createTransport({
	host: "smtp.163.com",
	port: 465,
	secureConnection: true,
	// 我们需要登录到网页邮箱中，然后配置SMTP和POP3服务器的密码
	// auth: {
	// 	user: "772051431@qq.com",
	// 	pass: "ltancxbuqqrjbgab",
	// },
	auth: {
		user: "joincan-spain@163.com",
		pass: "SNOMKBXFVWOKNCYW",
	},
})

module.exports = function (html, email, subject="你有一个新的订单") {
	var mailOptions = {
		// 发送邮件的地址
		from: '"mrmiss" joincan-spain@163.com', // login user must equal to this user
		// 接收邮件的地址
		to: email, // xrj0830@gmail.com
		// 邮件主题
		subject: subject,
		// 以HTML的格式显示，这样可以显示图片、链接、字体颜色等信息
		html,
	}
	return new Promise((resolve, reject) => {
		transporter.sendMail(mailOptions, (error, info = {}) => {
			if (error) {
				console.log(error)
				resolve(false)
			}
			resolve(true)
		})
	})
}
