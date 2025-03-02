import Message from '../models/message';
import { response } from '../utils';

/**
 * 获取用户的消息列表
 * @param {Object} ctx - Koa 上下文
 */
export const getUserMessages = async (ctx) => {
  try {

    const { userId } = ctx.params;
    const { modelId, type } = ctx.query;

    console.log("getUserMessages", userId)
    // 构建查询条件
    const query = { userId };
    if (modelId) query.modelId = modelId;
    if (type) query.type = type;

    // 查询消息列表，按创建时间降序排列
    const messages = await Message.find(query).sort({ createdAt: -1 });

    ctx.status = 200;
    ctx.body = response(true, messages, '成功');
  } catch (error) {
    ctx.status = 500;
    ctx.body = response(false, null, error.message);
  }
};

/**
 * 标记消息为已读
 * @param {Object} ctx - Koa 上下文
 */
export const markMessageAsRead = async (ctx) => {
  try {
    const { messageId } = ctx.params;

    // 更新消息为已读
    const message = await Message.findByIdAndUpdate(
      messageId,
      { isRead: true },
      { new: true } // 返回更新后的文档
    );

    if (!message) {
      ctx.status = 404;
      ctx.body = response(false, null, '消息未找到');
      return;
    }

    ctx.status = 200;
    ctx.body = response(true, message, '消息已标记为已读');
  } catch (error) {
    ctx.status = 500;
    ctx.body = response(false, null, error.message);
  }
};