import Router from "koa-router"

import config from "../config"
import * as Product from "../controlers/product"

const router = new Router()

router.post("/add", Product.add)
router.post("/deleteById", Product.deleteById)
router.post("/deleteMany", Product.deleteMany)
router.post("/update", Product.update)
router.get("/get", Product.get)
router.get("/getList", Product.getList)
router.get("/paginate", Product.paginate)

export default router.routes()
