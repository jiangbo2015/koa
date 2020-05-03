import Size from "../models/size"
import { response } from "../utils"

export const add = async (ctx, next) => {
	try {
		const body = ctx.request.body
		let size = new Size(body)
		let data = await size.save()
		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const getList = async (ctx, next) => {
	try {
		let { query } = ctx.request
		let data = await Size.find(query)
		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const update = async (ctx, next) => {
	try {
		const { _id, values, goods } = ctx.request.body
		let data = await Size.findByIdAndUpdate(
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

export const del = async (ctx, next) => {
	try {
		const { _id } = ctx.request.body
		let data = await Size.findByIdAndRemove({ _id })
		ctx.body = response(true, data, "成功")
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}
