import nodemailer from 'nodemailer';

// 创建邮件传输器
const transporter = nodemailer.createTransport({
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
});

/**
 * 发送邮件
 * @param {Object} options - 邮件选项
 * @param {String} options.to - 收件人邮箱
 * @param {String} options.subject - 邮件主题
 * @param {String} options.text - 邮件内容
 */
export const sendEmail = async ({ to, subject, text }) => {
  const mailOptions = {
    from: '"mrmiss" joincan-spain@163.com',
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};