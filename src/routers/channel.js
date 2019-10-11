import Router from "koa-router"

import config from "../config"
import * as Channel from "../controlers/channel"

const router = new Router()

router.post("/add", Channel.add)
// router.get("/getList", Channel.getList)

export default router.routes()
