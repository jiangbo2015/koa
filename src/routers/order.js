import Router from "koa-router"

import * as Order from "../controlers/order"

const router = new Router()

/**
 * @api {post} /order/add 添加订单
 * @apiName add
 * @apiGroup Order
 *
 * @apiParam  {String} code 通道编号
 * @apiParam  {String} name 通道名称
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/add", Order.add)

/**
 * @api {get} /order/getList 获取所有订单列表
 * @apiName getList
 * @apiGroup Order
 *
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.get("/getList", Order.getList)

/**
 * @api {get} /order/getMyList 获取该用户订单列表
 * @apiName getMyList
 * @apiGroup Order
 *
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.get("/getMyList", Order.getMyList)

export default router.routes()
