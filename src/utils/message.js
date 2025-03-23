import Message from '../models/message';
import mongoose from 'mongoose'
import { sendEmail } from '../utils/email'; // 假设有一个发送邮件的工具函数

/**
 * 插入消息并发送邮件
 * @param {mongoose.Types.ObjectId} userId - 用户 ID
 * @param {String} content - 消息内容
 * @returns {Promise<Object>} - 插入的消息对象
 */
export const addMessage = async (messageObj, isSendEmail) => {
    const {userId, content} = messageObj
    console.log("addMessage:", messageObj)
  // 插入消息
  const message = new Message(messageObj);
  console.log("addMessage: 1")
  await message.save();
  console.log("addMessage: 2")

  if (!isSendEmail){
    return;
  }
  // 发送邮件（假设用户模型中有 email 字段）
  const user = await mongoose.model('users').findById(userId);
  if (user && user.email) {
    await sendEmail({
      to: user.email,
      subject: '您有一条新消息',
      text: content,
    });
  }

  return message;
};