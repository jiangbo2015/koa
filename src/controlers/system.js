import System from "../models/system"
import { response } from "../utils"
import { handleUpload } from "../routers/common"

export const update = async (ctx, next) => {
	try {
		const { ...others } = ctx.request.body
		let data = await System.findOneAndUpdate(
			{
				// _id
			},
			others,
			{
				new: true,
				upsert: true
			}
		)

		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const detail = async (ctx, next) => {
	try {
		let data = await System.find()

		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const del = async (ctx, next) => {
	try {
		let data = await System.deleteMany()

		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}
