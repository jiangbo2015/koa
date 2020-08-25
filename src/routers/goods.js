import Router from "koa-router";

import config from "../config";
import * as Goods from "../controlers/goods";

const router = new Router();

/**
 * @api {post} /goods/add 添加商品
 * @apiName add
 * @apiGroup Goods
 * @apiParam  {String} name 商品名
 * @apiParam  {String} aliasName 展示商品名
 * @apiParam  {String} imgUrl 商品图
 * @apiParam  {Array {{name: String, sizeId: id}}} category 商品分类
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/add", Goods.add);

/**
 * @api {get} /goods/getList 获取列表
 * @apiName getList
 * @apiGroup Goods
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.get("/getList", Goods.getList);

/**
 * @api {get} /goods/getList 获取可见列表
 * @apiName getList
 * @apiGroup Goods
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.get("/getVisibleList", Goods.getVisibleList);

/**
 * @api {post} /goods/delete 删除
 * @apiName delete
 * @apiGroup Goods
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/delete", Goods.deleteById);

/**
 * @api {post} /goods/update 更新
 * @apiName update
 * @apiGroup Goods
 *
 * @apiParam  {String} _id 商品id
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/update", Goods.update);
router.post("/sort", Goods.sort);

/**
 * @api {get} /goods/detail 获取详情
 * @apiName detail
 * @apiGroup Goods
 *
 * @apiParam  {String} _id 商品id
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.get("/detail", Goods.detail);
// router.get("/get", Goods.get)
// router.get("/paginate", Goods.paginate)

export default router.routes();
