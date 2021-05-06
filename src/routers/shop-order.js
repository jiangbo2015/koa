import Router from "koa-router";
import * as ShopOrder from "../controlers/shop-order";

const router = new Router();

/**
 * @api {post} /ShopOrder/add 添加素色或花色
 * @apiName add
 * @apiGroup ShopOrder
 *
 * @apiParam  {Number} type 0-素色，1-花色
 * @apiParam  {String} value url或者RGB颜色
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/add", ShopOrder.add);

/**
 * @api {get} /ShopOrder/getList 获取颜色列表
 * @apiName getList
 * @apiGroup ShopOrder
 *
 * @apiParam  {String} type 0-素色，1-花色，不传则获取所有
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.get("/getList", ShopOrder.getList);
router.get("/getMyList", ShopOrder.getMyList);

/**
 * @api {post} /ShopOrder/update 更新
 * @apiName update
 * @apiGroup ShopOrder
 *
 * @apiParam  {String} _id 花色或者素色的id
 * @apiParam  {String} value 颜色或url
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/update", ShopOrder.update);

router.post("/merge", ShopOrder.merge);
/**
 * @api {post} /ShopOrder/delete 删除
 * @apiName delete
 * @apiGroup ShopOrder
 *
 * @apiParam  {String} _id 花色或者素色的id
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/delete", ShopOrder.del);
router.get("/orderRank", ShopOrder.orderRank);
router.get("/styleRank", ShopOrder.styleRank);
router.get("/userRank", ShopOrder.userRank);
router.post("/postDownload", ShopOrder.postDownload);
export default router.routes();
