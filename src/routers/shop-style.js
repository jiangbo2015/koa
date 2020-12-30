import Router from "koa-router";

import * as ShopStyle from "../controlers/shop-style";

const router = new Router();

/**
 * @api {post} /ShopStyle/add 添加素色或花色
 * @apiName add
 * @apiGroup ShopStyle
 *
 * @apiParam  {Number} type 0-素色，1-花色
 * @apiParam  {String} value url或者RGB颜色
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/add", ShopStyle.add);

/**
 * @api {get} /ShopStyle/getList 获取颜色列表
 * @apiName getList
 * @apiGroup ShopStyle
 *
 * @apiParam  {String} type 0-素色，1-花色，不传则获取所有
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.get("/getList", ShopStyle.getList);

/**
 * @api {post} /ShopStyle/update 更新
 * @apiName update
 * @apiGroup ShopStyle
 *
 * @apiParam  {String} _id 花色或者素色的id
 * @apiParam  {String} value 颜色或url
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/update", ShopStyle.update);

/**
 * @api {post} /ShopStyle/delete 删除
 * @apiName delete
 * @apiGroup ShopStyle
 *
 * @apiParam  {String} _id 花色或者素色的id
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/delete", ShopStyle.del);

export default router.routes();
