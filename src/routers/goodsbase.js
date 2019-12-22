import Router from "koa-router"

import * as GoodsBase from "../controlers/goods-base"
import * as Size from "../controlers/Size"

const router = new Router()

/**
 * @api {post} /size/add 添加尺寸
 * @apiName add
 * @apiGroup Goodsbase
 * @apiParam  {String} name 尺码名称
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/size/update", Size.update)

/**
 * @api {post} /size/update 更新尺寸
 * @apiName update
 * @apiGroup Goodsbase
 * @apiParam  {String} _id 尺码名称
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/size/add", Size.add)

/**
 * @api {get} /size/getList 获取尺寸列表
 * @apiName getList
 * @apiGroup Goodsbase
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.get("/size/getList", Size.getList)

/**
 * @api {post} /size/delete 删除尺寸
 * @apiName delete
 * @apiGroup Goodsbase
 * @apiParam  {String} _id 尺码id
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/size/delete", Size.del)

/**
 * @api {get} /rule/getInfo 获取规则信息
 * @apiName getList
 * @apiGroup Goodsbase
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {
 *      plainColor: 'S-',
 *      flowerColor: 'H-
 *     }}
 */
router.post("/rule/getInfo", GoodsBase.getRuleInfo)

export default router.routes()
