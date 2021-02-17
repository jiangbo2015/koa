import Router from "koa-router";

import * as Branch from "../controlers/branch";

const router = new Router();

/**
 * @api {post} /add 添加尺寸
 * @apiName add
 * @apiGroup Goodsbase
 * @apiParam  {String} name 尺码名称
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/update", Branch.update);

/**
 * @api {post} /update 更新尺寸
 * @apiName update
 * @apiGroup Goodsbase
 * @apiParam  {String} _id 尺码名称
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/add", Branch.add);

/**
 * @api {get} /getList 获取尺寸列表
 * @apiName getList
 * @apiGroup Goodsbase
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.get("/getList", Branch.getList);

router.get("/getVisibleList", Branch.getVisibleList);

/**
 * @api {post} /delete 删除尺寸
 * @apiName delete
 * @apiGroup Goodsbase
 * @apiParam  {String} _id 尺码id
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/delete", Branch.del);

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

export default router.routes();
