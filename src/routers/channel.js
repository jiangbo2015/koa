import Router from "koa-router"

import * as Channel from "../controlers/channel"

const router = new Router()

/**
 * @api {post} /channel/add 添加通道
 * @apiName add
 * @apiGroup Channel
 *
 * @apiParam  {String} currency 0-人民币，1-美元，2-欧元
 * @apiParam  {String} code 通道编号
 * @apiParam  {String} name 通道名称
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/add", Channel.add)

/**
 * @api {get} /channel/getList 获取所有通道
 * @apiName getList
 * @apiGroup Channel
 *
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.get("/getList", Channel.getList)

/**
 * @api {post} /channel/delete 删除通道
 * @apiName delete
 * @apiGroup Channel
 *
 * @apiParam  {String} _id 通道id
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/delete", Channel.del)

/**
 * @api {post} /channel/update 更新通道
 * @apiName update
 * @apiGroup Channel
 *
 * @apiParam  {String} _id 通道id
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/update", Channel.update)

router.post("/assign", Channel.assign)
router.post("/unassign", Channel.unassign)
router.get("/getAssign", Channel.getAssign)

export default router.routes()
