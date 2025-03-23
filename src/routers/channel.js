import Router from "koa-router";

import * as Channel from "../controlers/channel";

const router = new Router();

/**
 * @api {post} /Channel/add 添加素色或花色
 * @apiName add
 * @apiGroup Channel
 *
 * @apiParam  {Number} type 0-素色，1-花色
 * @apiParam  {String} value url或者RGB颜色
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/add", Channel.add);

/**
 * @api {get} /Channel/getList 获取颜色列表
 * @apiName getList
 * @apiGroup Channel
 *
 * @apiParam  {String} type 0-素色，1-花色，不传则获取所有
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.get("/getMyAdminList", Channel.getMyAdminList);
router.get("/getList", Channel.findAll);
router.get("/findById", Channel.findById);

/**
 * @api {post} /Channel/update 更新
 * @apiName update
 * @apiGroup Channel
 *
 * @apiParam  {String} _id 花色或者素色的id
 * @apiParam  {String} value 颜色或url
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/update", Channel.update);

/**
 * @api {post} /Channel/updateCapsules 更新
 * @apiName updateCapsules
 * @apiGroup Channel
 *
 * @apiParam  {String} _id
 * @apiParam  {Array} capsules 胶囊ID列表
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/updateCapsules", Channel.updateCapsules);
router.post("/updateCostomers", Channel.updateCostomers);

/**
 * @api {post} /Channel/delete 删除
 * @apiName delete
 * @apiGroup Channel
 *
 * @apiParam  {String} _id 花色或者素色的id
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.post("/delete", Channel.del);

export default router.routes();
