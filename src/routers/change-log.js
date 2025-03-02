import Router from 'koa-router';
import {
  getAllChangeLogs
} from '../controlers/change-log';

const router = new Router();

// 获取修改历史列表
router.get('/changeLogs/getChangeLogs', getAllChangeLogs);


export default router.routes();