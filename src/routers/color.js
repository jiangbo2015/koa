import Router from "koa-router"

import * as Color from "../controlers/color"

const router = new Router()

/**
 * @api {post} /color/add 添加素色或花色
 * @apiName add
 * @apiGroup Color
 *
 * @apiParam  {Number} type 0-素色，1-花色
 * @apiParam  {String} value url或者RGB颜色
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/add", Color.add)

/**
 * @api {get} /color/getList 获取颜色列表
 * @apiName getList
 * @apiGroup Color
 *
 * @apiParam  {String} type 0-素色，1-花色，不传则获取所有
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.get("/getList", Color.getList)

/**
 * @api {post} /color/update 更新
 * @apiName update
 * @apiGroup Color
 *
 * @apiParam  {String} _id 花色或者素色的id
 * @apiParam  {String} value 颜色或url
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/update", Color.update)

/**
 * @api {post} /color/delete 删除
 * @apiName delete
 * @apiGroup Color
 *
 * @apiParam  {String} _id 花色或者素色的id
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/delete", Color.del)

router.get("/getAllList", Color.getAllList)

export default router.routes()
