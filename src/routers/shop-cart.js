import Router from "koa-router";

import * as ShopCart from "../controlers/shop-cart";

const router = new Router();

/**
 * @api {post} /ShopCart/add 添加素色或花色
 * @apiName add
 * @apiGroup ShopCart
 *
 * @apiParam  {Number} type 0-素色，1-花色
 * @apiParam  {String} value url或者RGB颜色
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/add", ShopCart.add);

/**
 * @api {get} /ShopCart/getList 获取颜色列表
 * @apiName getList
 * @apiGroup ShopCart
 *
 * @apiParam  {String} type 0-素色，1-花色，不传则获取所有
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.get("/getList", ShopCart.getList);

/**
 * @api {get} /ShopCart/getMyList 获取我的购物车列表
 * @apiName getList
 * @apiGroup ShopCart
 *
 * @apiParam  {String} type 0-素色，1-花色，不传则获取所有
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.get("/getMyList", ShopCart.getMyList);

/**
 * @api {post} /ShopCart/update 更新
 * @apiName update
 * @apiGroup ShopCart
 *
 * @apiParam  {String} _id 花色或者素色的id
 * @apiParam  {String} value 颜色或url
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/update", ShopCart.update);

/**
 * @api {post} /ShopCart/delete 删除
 * @apiName delete
 * @apiGroup ShopCart
 *
 * @apiParam  {String} _id 花色或者素色的id
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/delete", ShopCart.del);

export default router.routes();
