import Helpfiles from "../models/helpfiles"
import { response } from "../utils"

export const add = async (ctx, next) => {
	try {
		const body = ctx.request.body
		let helpfiles = new Helpfiles(body)
		let data = await helpfiles.save()
		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}
export const del = async (ctx, next) => {
	try {
		const { _id } = ctx.request.body
		let data = await Helpfiles.findByIdAndRemove({ _id })
		ctx.body = response(true, data, "成功")
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}

export const getList = async (ctx, next) => {
	try {
		let data = await Helpfiles.find()
		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

// export const update = async (ctx, next) => {
// 	try {
// 		const { _id, values, goods } = ctx.request.body
// 		let data = await Helpfiles.findByIdAndUpdate(
// 			{ _id },
// 			{ values, goods },
// 			{ new: true }
// 		)
// 		ctx.body = response(true, data, "成功")
// 	} catch (err) {
// 		console.log(err)
// 		ctx.body = response(false, null, err.message)
// 	}
// }
