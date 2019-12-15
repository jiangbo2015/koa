import Router from "koa-router"

import * as System from "../controlers/system"

const router = new Router()

/**
 * @api {post} /system/update 系统设置，邮箱
 * @apiName update
 * @apiGroup system
 *
 * @apiParam  {String} email 系统邮箱
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/update", System.update)

/**
 * @api {post} /system/detail 获取系统信息
 * @apiName detail
 * @apiGroup system
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.get("/detail", System.detail)
router.post("/delete", System.del)

export default router.routes()
