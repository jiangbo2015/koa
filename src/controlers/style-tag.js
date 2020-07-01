import StyleTag from "../models/style-tag"
import { response } from "../utils"

export const add = async (ctx, next) => {
	try {
		const body = ctx.request.body
		let styleTag = new StyleTag(body)
		let data = await styleTag.save()
		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const getList = async (ctx, next) => {
	try {
		let data = await StyleTag.find()
		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const update = async (ctx, next) => {
	try {
		const { _id, values, goods } = ctx.request.body
		let data = await StyleTag.findByIdAndUpdate(
			{ _id },
			{ values, goods },
			{ new: true }
		)
		ctx.body = response(true, data, "成功")
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}
