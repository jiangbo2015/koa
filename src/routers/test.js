import Router from "koa-router"

import * as Test from "../controlers/test"

const router = new Router()

/**
 * @api {post} /channel/add 添加通道
 * @apiName add
 * @apiGroup Channel
 *
 * @apiParam  {String} currency 0-素色，1-花色，不传则获取所有
 * @apiParam  {String} code 通道编号
 * @apiParam  {String} name 通道名称
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/add", Test.add)
router.get("/getList", Test.getList)

export default router.routes()
