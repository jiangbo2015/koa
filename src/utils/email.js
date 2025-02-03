import nodemailer from 'nodemailer';

// 创建邮件传输器
const transporter = nodemailer.createTransport({
  service: 'Gmail', // 使用 Gmail 服务
  auth: {
    user: process.env.EMAIL_USER, // 发件人邮箱
    pass: process.env.EMAIL_PASSWORD, // 发件人邮箱密码
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
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};