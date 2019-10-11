import Router from "koa-router"
import fse from "fs-extra"
import path from "path"
import moment from "moment"

const router = new Router()

// 上传
router.post("/upload", async (ctx, next) => {
	// 上传单个文件
	const file = ctx.request.files.file
	// 创建可读流
	const folder = moment().format("YYYY-MM-DD")
	const _path = path.join(__dirname, `../public/uploads/${folder}/`)
	await fse.ensureDir(_path)
	const reader = fse.createReadStream(file.path)
	let filePath = path.join(_path, file.name)

	// 创建可写流
	const upStream = fse.createWriteStream(filePath)
	// 可读流通过管道写入可写流
	reader.pipe(upStream)
	ctx.body = filePath
})

export default router.routes()
