import Router from "koa-router"

import * as User from "../controlers/user"

const router = new Router()

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
router.post("/login", User.login)

/**
 * @api {post} /user/add 添加用户
 * @apiName add
 * @apiGroup User
 *
 * @apiParam  {String} account 账号
 * @apiParam  {String} password 密码
 * @apiParam  {Number} role 角色 0-超级管理员，1-产品经理，2-视觉设计，3-用户
 * @apiParam  {String} name 姓名
 *
 * @apiSuccessExample {type} Success-Response:
 * {
 *     success: true,
 *     data: {}
 * }
 *
 */

router.post("/add", User.add)

/**
 * @api {get} /user/getList 获取用户列表
 * @apiName getList
 * @apiGroup User
 * @apiSuccessExample {json} Success-Response:
 *    {success: true, data: {}}
 */
router.get("/getList", User.getList)

/**
 * @api {post} /user/delete 删除用户
 * @apiName delete
 * @apiGroup User
 *
 * @apiParam  {String} _id 用户id
 * @apiSuccessExample {json} Success-Response:
 *    {success: true, data: {}}
 */

router.post("/delete", User.deleteById)

/**
 * @api {get} /user/getCurrentUser 获取当前用户
 * @apiName getCurrentUser
 * @apiGroup User
 *
 * @apiSuccessExample {json} Success-Response:
 *    {success: true, data: {}}
 *
 */
router.get("/getCurrentUser", User.getCurrentUser)

export default router.routes()
