import Router from "koa-router"

import * as Color from "../controlers/color"

const router = new Router()

router.post("/add", Color.add)
router.post("/getList", Color.getList)
router.post("/update", Color.update)
router.post("/delete", Color.del)

export default router.routes()
