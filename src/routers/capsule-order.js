import Router from "koa-router";
import * as Order from "../controlers/capsule-order";

const router = new Router();

/**
 * @api {post} /order/add 添加订单
 * @apiName add
 * @apiGroup Order
 *
 * @apiParam  {Object} orderData 订单数据
 * @apiParam  {Number} packageCount 包数量
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/add", Order.add);

/**
 * @api {get} /order/getList 获取所有订单列表
 * @apiName getList
 * @apiGroup Order
 *
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.get("/getList", Order.getList);

/**
 * @api {get} /order/getMyList 获取该用户订单列表
 * @apiName getMyList
 * @apiGroup Order
 *
 * @apiParam  {String} isSend 是否已发送 0-未发送，1-已发送
 *
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.get("/getMyList", Order.getMyList);

/**
 * @api {post} /order/send 发送订单
 * @apiName send
 * @apiGroup Order
 *
 * @apiParam  {Object} list 订单id 数组
 *
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/send", Order.send);

router.get("/download", Order.download);
router.get("/detail", Order.detail);
router.get("/getAllList", Order.getAllList);

router.post("/delete", Order.del);
router.post("/clear", Order.clear);
router.post("/update", Order.update);
router.post("/postDownload", Order.postDownload);
router.get("/orderRank", Order.orderRank);
router.get("/styleRank", Order.styleRank);
router.get("/userRank", Order.userRank);

export default router.routes();
