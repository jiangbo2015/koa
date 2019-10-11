import Router from "koa-router"

import user from "./user"
import common from "./common"
import product from "./product"
import channel from "./channel"

const router = new Router({
	prefix: "/api"
})

router.use("/user", user)
router.use("/common", common)
router.use("/product", product)
router.use("/channel", channel)

export default router
