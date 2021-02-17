import Router from "koa-router";

import * as Capsule from "../controlers/capsule";

const router = new Router();

/**
 * @api {post} /Capsule/add 添加素色或花色
 * @apiName add
 * @apiGroup Capsule
 *
 * @apiParam  {Number} type 0-素色，1-花色
 * @apiParam  {String} value url或者RGB颜色
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/add", Capsule.add);

/**
 * @api {get} /Capsule/getList 获取颜色列表
 * @apiName getList
 * @apiGroup Capsule
 *
 * @apiParam  {String} type 0-素色，1-花色，不传则获取所有
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.get("/getList", Capsule.getList);

router.get("/getVisibleList", Capsule.getVisibleList);

/**
 * @api {post} /Capsule/update 更新
 * @apiName update
 * @apiGroup Capsule
 *
 * @apiParam  {String} _id 花色或者素色的id
 * @apiParam  {String} value 颜色或url
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/update", Capsule.update);

/**
 * @api {post} /Capsule/delete 删除
 * @apiName delete
 * @apiGroup Capsule
 *
 * @apiParam  {String} _id 花色或者素色的id
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/delete", Capsule.del);

export default router.routes();
