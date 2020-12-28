import Router from "koa-router";

import * as CapsuleStyle from "../controlers/capsule-style";

const router = new Router();

/**
 * @api {post} /CapsuleStyle/add 添加素色或花色
 * @apiName add
 * @apiGroup CapsuleStyle
 *
 * @apiParam  {Number} type 0-素色，1-花色
 * @apiParam  {String} value url或者RGB颜色
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/add", CapsuleStyle.add);

/**
 * @api {get} /CapsuleStyle/getList 获取颜色列表
 * @apiName getList
 * @apiGroup CapsuleStyle
 *
 * @apiParam  {String} type 0-素色，1-花色，不传则获取所有
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.get("/getList", CapsuleStyle.getList);

/**
 * @api {post} /CapsuleStyle/update 更新
 * @apiName update
 * @apiGroup CapsuleStyle
 *
 * @apiParam  {String} _id 花色或者素色的id
 * @apiParam  {String} value 颜色或url
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/update", CapsuleStyle.update);

/**
 * @api {post} /CapsuleStyle/delete 删除
 * @apiName delete
 * @apiGroup CapsuleStyle
 *
 * @apiParam  {String} _id 花色或者素色的id
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/delete", CapsuleStyle.del);

export default router.routes();
