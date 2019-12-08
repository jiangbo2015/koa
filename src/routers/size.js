import Router from "koa-router"

import * as Size from "../controlers/goods"

const router = new Router()

/**
 * @api {post} /size/add 添加尺寸
 * @apiName add
 * @apiGroup Size
 * @apiParam  {String} name 尺码名称
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/add", Size.add)
