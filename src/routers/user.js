import Router from "koa-router";
import * as User from "../controlers/user";

const router = new Router();

/**
 * @api {post} /user/login 用户登录
 * @apiName login
 * @apiGroup User
 *
 * @apiParam {String} account 账号
 * @apiParam {String} password 密码
 *
 * @apiSuccessExample {json} Success-Response:
 * {
    "success": true,
    "data": {},
    "message": "成功"
}
 * 
 */
router.post("/login", User.login);

/**
 * @api {post} /user/add 添加用户
 * @apiName add
 * @apiGroup User
 *
 * @apiParam  {String} account 账号
 * @apiParam  {String} password 密码
 * @apiParam  {Number} role 角色 0-超级管理员，1-产品经理，2-视觉设计，3-用户
 * @apiParam  {String} name 姓名
 * @apiParam  {String} [email] 邮箱
 * @apiParam  {String} [address] 地址
 * @apiParam  {String} [contact] 联系人
 * @apiParam  {String} [phone] 联系电话
 * @apiParam  {String} [customerType] 客户类型
 * @apiParam  {String} [remark] 备注
 * @apiParam  {String} [channels] 管理的通道id,用英文逗号隔开
 *
 * @apiSuccessExample {type} Success-Response:
 * {
 *     success: true,
 *     data: {
 *          token: "qwertyuiopasdfghihp"
 *     }
 * }
 *
 */
router.post("/add", User.add);

/**
 * @api {get} /user/getList 获取用户列表
 * @apiName getList
 * @apiGroup User
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.get("/getList", User.getList);

/**
 * @api {get} /user/getOwnList 获取产品经理下用户的列表
 * @apiName getOwnList
 * @apiGroup User
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */
router.get("/getOwnList", User.getOwnList)

/**
 * @api {post} /user/delete 删除用户
 * @apiName delete
 * @apiGroup User
 *
 * @apiParam  {String} _id 用户id
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 */

router.post("/delete", User.deleteById);

/**
 * @api {get} /user/getCurrentUser 获取当前用户
 * @apiName getCurrentUser
 * @apiGroup User
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 *
 */
router.get("/getCurrentUser", User.getCurrentUser);

/**
 * @api {post} /user/update 更新用户信息
 * @apiName update
 * @apiGroup User
 *
 * @apiParam  {String} _id 用户id
 * @apiParam  {Object} object 添加用户时用的那些字段
 *
 * @apiSuccessExample {json} Success-Response:
 *    {"success": true, "data": {}}
 *
 */
router.post("/update", User.update);

router.get("/getUserChannels", User.getUserChannels);
router.post("/feedback", User.feedback);
router.post("/changePwd", User.changePwd);
router.get("/download", User.download);

router.post("/updateUsers", User.updateUsers);


export default router.routes();
