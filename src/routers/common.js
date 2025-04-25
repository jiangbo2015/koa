import Router from "koa-router"
import fse from "fs-extra"
import path from "path"
import moment from "moment"
import { response } from "../utils"
import { handleUploadKit } from "../controlers/imagekit"
const router = new Router()

/**
 * @api {post} /common/upload 文件上传
 * @apiName upload
 * @apiGroup Common
 * 
 * @apiParam  {String} file 文件
 * 
 * @apiSuccessExample {json} Success-Response:
 *    {
    "success": true,
    "data": {
        "url": "uploads/2019-11-27/1574848148287.png"
    },
    "message": "成功"
}
 */

export const handleUpload = async (ctx) => {
	const file = ctx.request.files.file
	// 创建可读流
	const reader = fse.createReadStream(file.path)

	let relativePath = [
		`uploads`,
		`${moment().format("YYYY-MM-DD")}`,
		`${new Date().getTime()}${path.extname(file.name)}`,
	].join("/")
	let absPath = path.join(__dirname, "../public/" + relativePath)
	fse.ensureDirSync(path.dirname(absPath))

	// 创建可写流
	const upStream = fse.createWriteStream(absPath)
	// 可读流通过管道写入可写流
	reader.pipe(upStream)
	return relativePath
}
router.post("/upload", async (ctx, next) => {
	try {
		// 上传单个文件
		const relativePath = await handleUpload(ctx)
		ctx.body = response(true, { url: relativePath }, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
})

router.post("/uploadkit", async (ctx, next) => {
	try {
		// 上传单个文件
		const file = ctx.request.files.file
		let relativePath = ""
		if (file.type === "image/svg+xml") {
			relativePath = await handleUpload(ctx)
		} else {
			relativePath = await handleUploadKit(ctx)
		}
        if(relativePath) {
            ctx.body = response(true, { url: relativePath }, "成功")
        }else {
            ctx.body = response(false, null, 'upload error')
        }
		
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
})

export default router.routes()
