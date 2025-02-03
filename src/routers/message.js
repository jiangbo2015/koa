import Router from 'koa-router';
import {
  getUserMessages,
  markMessageAsRead,
} from '../controlers/message';

const router = new Router();

// 获取用户的消息列表
router.get('/users/:userId/messages', getUserMessages);

// 标记消息为已读
router.patch('/messages/:messageId/read', markMessageAsRead);

export default router.routes();