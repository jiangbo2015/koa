import Router from "koa-router"

import * as Channel from "../controlers/channel"

const router = new Router()

router.post("/add", Channel.add)

export default router.routes()
