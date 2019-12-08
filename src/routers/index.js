import Router from "koa-router"

import user from "./user"
import common from "./common"
import goods from "./goods"
import goodsbase from "./goodsbase"
import channel from "./channel"
import color from "./color"
import style from "./style"

const router = new Router({
	prefix: "/api"
})

router.use("/user", user)
router.use("/common", common)
router.use("/goods", goods)
router.use("/goodsbase", goodsbase)
router.use("/channel", channel)
router.use("/color", color)
router.use("/style", style)

export default router
