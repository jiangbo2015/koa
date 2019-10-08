import Router from "koa-router"
import jwt from "jsonwebtoken"

import config from "../config"
import * as User from "../controlers/user"

const router = new Router()

// 登录
router.get("/test", (ctx, next) => {
	console.log("/test")
	ctx.body = "test"
})

router.post("/login", User.login)
router.post("/add", User.add)
router.post("/update", User.update)
router.post("/deleteMany", User.deleteMany)
router.post("/deleteById", User.deleteById)
router.get("/getList", User.getList)
router.get("/aggregate", User.aggregate)
router.get("/getUserById", User.getUserById)
router.get("/register", User.register)
router.get("/getCurrentUser", User.getCurrentUser)

router.get("/login12", (ctx, next) => {
	console.log("/test")
	const token = jwt.sign({ phone: "17317276707" }, config.secret)
	ctx.body = {
		token
	}
})

export default router.routes()
